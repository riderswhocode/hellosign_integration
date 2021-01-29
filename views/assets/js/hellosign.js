import HelloSign from 'hellosign-embedded'

function getSignUrl(signUrl) {
    const client = new HelloSign()

    client.open(signUrl, {
    clientId: '5f86a503c0e0f2cf9908ccbe5df1d16a'
    })
}
document.addEventListener("DOMContentLoaded", getSignUrl)