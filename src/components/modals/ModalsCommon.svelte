<script context="module">
	// #TODO: showModal()  and closeModalWithEsc() is duplicated in index.svelte
	export function showModal(modalID, type, data) {
			console.log("@modalID", modalID);
			if (type == "EditLine") {
			}
			document.getElementById(modalID).classList.add("show");
			document.addEventListener("keyup", (e) =>
					closeModalWithEsc(e, modalID)
			);
	}

	export function closeModal(modalID) {
      document.getElementById(modalID).classList.remove('show')
      // #TODO: removeEventListener() ?
  }

	function closeModalWithEsc(e, modalID) {
			if (e.key == "Escape" || e.keyCode == 27) {
					closeModal(modalID);
			}
	}
</script>
