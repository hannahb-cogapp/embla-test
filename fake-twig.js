// Stands in for the Craft template. Runs on import, before main.js, so the DOM
// main.js sees matches what Twig would have rendered on the server.

// Shape of `entry.carouselSlides.all()`.
const slides = [
  { title: 'Slide 1', url: '/slides/slide-1', image: { url: 'https://placehold.co/400x300', alt: '' } },
  { title: 'Slide 2', url: '/slides/slide-2', image: { url: 'https://placehold.co/400x300', alt: '' } },
  { title: 'Slide 3', url: '/slides/slide-3', image: { url: 'https://placehold.co/400x300', alt: '' } },
  { title: 'Slide 4', url: '/slides/slide-4', image: { url: 'https://placehold.co/400x300', alt: '' } },
]

// Embla loops by moving real slides, so the slides off screen must fill the
// viewport on their own. At the 2/9 slide width in style.css that needs 6;
// below that Embla disables loop without warning. Change with the CSS.
const minLoopSlides = 6

function renderSlide(slide) {
  return `
    <div class="embla__slide">
      <div class="embla__slide__inner">
        <img class="embla__slide__img" src="${slide.image.url}" alt="${slide.image.alt}" />
        <h2 class="embla__slide__heading"><a href="${slide.url}">${slide.title}</a></h2>
      </div>
    </div>`
}

function renderCarousel() {
  if (!slides.length) return ''
  const sets = Math.max(Math.ceil(minLoopSlides / slides.length), 1)
  let html = ''
  for (let i = 0; i < sets; i++) {
    html += slides.map(renderSlide).join('')
  }
  return `<div class="embla__container" data-slide-count="${slides.length}">${html}</div>`
}

document.querySelectorAll('.embla__viewport').forEach((node) => {
  node.innerHTML = renderCarousel()
})
