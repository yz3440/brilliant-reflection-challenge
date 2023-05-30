function updateDOM() {
  if (hasHitEyeOnce) {
    $('#instruction').html(`
    Look! The  <span class="text-yellow-500 font-bold">reflected ray</span> formed <span class='font-bold text-green-700'>two equal angles</span>.
    `);
    $('#following-text').removeClass('hidden opacity-0');
    $('#following-text').addClass('');
  }
}
