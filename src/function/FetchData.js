export const FetchData = {
    async data() {
        var result = [];
        await fetch('https://gist.githubusercontent.com/Kimitsuki/3e2ebbcdb3fd75a3f956a7d30eeaa048/raw/87a02aa21a4918a5ca9de1279eb90b6adc29e8cb/poi.js')
            .then((response) => response.json())
            .then((responseJSON) => {
                result = responseJSON
            })
        return result;
    }
}
