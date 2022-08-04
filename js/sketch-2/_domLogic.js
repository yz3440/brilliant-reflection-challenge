function updateDOM() {
  if (getFoundTargets().length >= 6) {
    $('#instruction').html(`
    Awesome! You have found <span id="virtual-img-count">${
      getFoundTargets().length - 1
    }</span> new <span class="text-red-300 font-bold">reflected image</span>.
    `);

    // show the following text
    $('#following-text').removeClass('hidden opacity-0');
    $('#following-text').addClass('');
  } else if (getFoundTargets().length > 1) {
    $('#instruction').html(`
    You have found <span id="virtual-img-count">${
      getFoundTargets().length - 1
    }</span> new <span class="text-red-300 font-bold">reflected image</span>.
    `);
  } else if (ray.hasHitAnyTarget && ray.trace.length > 2) {
    $('#instruction').html(
      `
      <span class='text-zinc-700 font-bold'>Hold down your cursor</span> to investigate <span class="text-red-300 font-bold">reflected image</span>.
      `
    );
  }
}

$('#show-more').click(() => {
  targets.forEach((target) => {
    target.hidden = false;
  });
});
