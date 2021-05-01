export const FetchData = {
    async data() {
        var result = [];
        await fetch('https://gist.githubusercontent.com/Kimitsuki/3e2ebbcdb3fd75a3f956a7d30eeaa048/raw/6b1ffeb2bc1253df68469300d93ec86158bea60b/poi.js')
            .then((response) => response.json())
            .then((responseJSON) => {
                result = responseJSON
            })
        return result;
    }
}
