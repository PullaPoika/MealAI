function validateForm() {
    if (document.getElementById('name') && document.getElementById('content')) {
        document.getElementsByClassName('review-form')[0].submit()
        return
    }
    document.getElementById('review-submit-button').style.backgroundColor = "#dc3545";
}
