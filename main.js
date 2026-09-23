import EmblaCarousel from 'embla-carousel'
import Accessibility from 'embla-carousel-accessibility'
import './fake-twig.js'

const options = {
  loop: true,
  align: 'start',
  breakpoints: { '(prefers-reduced-motion: reduce)': { duration: 0 } },
}

function setupCarousel(rootNode, { tween }) {
  const viewportNode = rootNode.querySelector('.embla__viewport')
  const containerNode = viewportNode.querySelector('.embla__container')
  // The template repeats the slides for looping; this is the count before repeats.
  const slideCount = Number(containerNode.dataset.slideCount)

  const emblaApi = EmblaCarousel(viewportNode, options, [
    Accessibility({
      carouselAriaLabel: rootNode.dataset.label,
      announceChanges: true,
      // Number clones as the slide they copy, so the count stays at the real total.
      slideAriaLabel: (_, slideIndex) => `Slide ${(slideIndex % slideCount) + 1} of ${slideCount}`,
      liveRegionContent: (_, slideIndex) =>
        `Showing slide ${(slideIndex % slideCount) + 1} of ${slideCount}`,
      // Buttons and live region sit outside the viewport, in .embla.
      rootNode: (root) => root.parentElement,
    }),
  ])

  // reInit rebuilds the plugin, which drops its hold on the buttons and live region.
  function setupAccessibility() {
    const accessibility = emblaApi.plugins().accessibility
    accessibility.setupPrevAndNextButtons('.embla__prev', '.embla__next')
    accessibility.setupLiveRegion('.embla__live-region')
  }

  // Every slide has the same layout width. Scale runs from 1 in the featured
  // slot down to 0.5 one slot away, and each card moves right by the extra
  // width of the cards to its left, so the row stays edge to edge mid-scroll.
  function tweenScale() {
    const slides = emblaApi.slideNodes()
    const width = slides[0].offsetWidth
    const viewportLeft = viewportNode.getBoundingClientRect().left
    // Slots from the featured position, read from the DOM so loop moves count.
    const slots = slides.map((slide) => (slide.getBoundingClientRect().left - viewportLeft) / width)
    const scales = slots.map((slot) => 0.5 + 0.5 * Math.max(0, 1 - Math.abs(slot)))
    slides.forEach((slide, i) => {
      const shift = slots.reduce(
        (sum, slot, j) => (slot < slots[i] ? sum + (2 * scales[j] - 1) * width : sum),
        0,
      )
      slide.firstElementChild.style.transform = `translateX(${shift}px) scale(${scales[i]})`
    })
  }

  // The featured slide's layout width changes, so Embla has to re-measure.
  function setFeaturedSlide() {
    const selected = emblaApi.selectedSnap()
    emblaApi.slideNodes().forEach((slide, i) => slide.classList.toggle('is-featured', i === selected))
    emblaApi.reInit()
  }

  emblaApi.on('reinit', setupAccessibility)
  setupAccessibility()
  if (tween) {
    emblaApi.on('scroll', tweenScale)
    emblaApi.on('reinit', tweenScale)
    tweenScale()
  } else {
    emblaApi.on('select', setFeaturedSlide)
    setFeaturedSlide()
  }

  rootNode.querySelector('.embla__prev').addEventListener('click', () => emblaApi.goToPrev())
  rootNode.querySelector('.embla__next').addEventListener('click', () => emblaApi.goToNext())
}

document.querySelectorAll('.embla').forEach((rootNode) => {
  setupCarousel(rootNode, { tween: !rootNode.classList.contains('embla--no-tween') })
})
