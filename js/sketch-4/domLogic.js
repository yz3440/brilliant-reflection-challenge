function updateDOM() {
  if (getFoundTargets().length >= 1) {
    $('#instruction').html(`
    Drag the<span class="text-gray-700 font-bold"> eye </span> to move
    around the room.<br/>
    You have found <span id="virtual-img-count">${
      getFoundTargets().length
    }</span> <span class="text-red-300 font-bold">reflected images</span>.
    `);
    // show the following text
    $('#following-text').removeClass('hidden opacity-0');
    $('#following-text').addClass('');
  }
}
