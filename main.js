import EmblaCarousel from 'embla-carousel'

const viewportNode = document.querySelector('.embla__viewport')
const liveRegionNode = document.querySelector('.embla__live-region')
const emblaApi = EmblaCarousel(viewportNode, { loop: true, align: 'start' })

const slideNodes = emblaApi.slideNodes()

function setFeaturedSlide() {
  const selected = emblaApi.selectedScrollSnap()
  slideNodes.forEach((slide, i) => slide.classList.toggle('is-featured', i === selected))
  emblaApi.reInit()
  emblaApi.scrollTo(selected, true)
}

function updateSlidesInView() {
  const inView = emblaApi.slidesInView()
  slideNodes.forEach((slide, i) => {
    const hidden = !inView.includes(i)
    slide.setAttribute('aria-hidden', hidden ? 'true' : 'false')
    slide.setAttribute('tabindex', hidden ? '-1' : '0')
  })
}

function announceSelectedSlide() {
  const selected = emblaApi.selectedScrollSnap()
  liveRegionNode.textContent = `Slide ${selected + 1} of ${slideNodes.length}`
}

emblaApi.on('select', setFeaturedSlide)
emblaApi.on('select', announceSelectedSlide)
emblaApi.on('slidesInView', updateSlidesInView)
emblaApi.on('reInit', updateSlidesInView)
setFeaturedSlide()
updateSlidesInView()

document.querySelector('.embla__prev').addEventListener('click', () => emblaApi.scrollPrev())
document.querySelector('.embla__next').addEventListener('click', () => emblaApi.scrollNext())
