import EmblaCarousel from 'embla-carousel'
import Accessibility from 'embla-carousel-accessibility'
import './fake-twig.js'

const viewportNode = document.querySelector('.embla__viewport')
const containerNode = viewportNode.querySelector('.embla__container')
// The template repeats the slides for looping; this is the count before repeats.
const slideCount = Number(containerNode.dataset.slideCount)

const emblaApi = EmblaCarousel(viewportNode, { loop: true, align: 'start' }, [
  Accessibility({
    carouselAriaLabel: 'Featured slides',
    announceChanges: true,
    // Number clones as the slide they copy, so the count stays at the real total.
    slideAriaLabel: (_, slideIndex) => `Slide ${(slideIndex % slideCount) + 1} of ${slideCount}`,
    liveRegionContent: (_, slideIndex) =>
      `Showing slide ${(slideIndex % slideCount) + 1} of ${slideCount}`,
    // Buttons and live region sit outside the viewport, in .embla.
    rootNode: (root) => root.parentElement,
  }),
])

const slideNodes = emblaApi.slideNodes()

// reInit rebuilds the plugin, which drops its hold on the buttons and live region.
function setupAccessibility() {
  const accessibility = emblaApi.plugins().accessibility
  accessibility.setupPrevAndNextButtons('.embla__prev', '.embla__next')
  accessibility.setupLiveRegion('.embla__live-region')
}

function setFeaturedSlide() {
  const selected = emblaApi.selectedSnap()
  slideNodes.forEach((slide, i) => slide.classList.toggle('is-featured', i === selected))
  emblaApi.reInit()
}

emblaApi.on('select', setFeaturedSlide)
emblaApi.on('reinit', setupAccessibility)
setFeaturedSlide()

document.querySelector('.embla__prev').addEventListener('click', () => emblaApi.goToPrev())
document.querySelector('.embla__next').addEventListener('click', () => emblaApi.goToNext())
