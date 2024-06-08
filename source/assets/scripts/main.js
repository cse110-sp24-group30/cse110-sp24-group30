window.addEventListener('DOMContentLoaded', init);

function init() {
// Ensure protected pages check authentication on load
    if (document.body.contains(document.getElementById('protected-content'))) {
        if (sessionStorage.getItem('authenticated') !== 'true') {
            const rootUrl = window.location.origin + window.location.pathname.split('/').slice(0, 2).join('/');
            window.location.href = rootUrl+'/login/login.html';
            alert('Please log in to access this page.');
        }
    }
}