---
layout: base
css: master
---
<script type="text/javascript">
function loadPlayground (iframe) {
	if (iframe.src != window.location.origin + '/oidc_playground/playground/index.html') {
		iframe.src = window.location.origin + '/oidc_playground/playground/index.html';
		//hide the side bar
		document.getElementById('oidc_playground').className += ' toggled';
	}
};
</script>

<iframe src="" onload="loadPlayground(this)" class="playgroundIframe"></iframe>
