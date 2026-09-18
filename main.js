import EmblaCarousel from 'embla-carousel'

const viewportNode = document.querySelector('.embla__viewport')
const emblaApi = EmblaCarousel(viewportNode, { loop: true, align: 'start' })

const slideNodes = emblaApi.slideNodes()

function setFeaturedSlide() {
  const selected = emblaApi.selectedScrollSnap()
  slideNodes.forEach((slide, i) => slide.classList.toggle('is-featured', i === selected))
  emblaApi.reInit()
  emblaApi.scrollTo(selected, true)
}

emblaApi.on('select', setFeaturedSlide)
setFeaturedSlide()

document.querySelector('.embla__prev').addEventListener('click', () => emblaApi.scrollPrev())
document.querySelector('.embla__next').addEventListener('click', () => emblaApi.scrollNext())
