export const FetchData = {
    async data() {
        var result = [];
        await fetch('https://gist.githubusercontent.com/dung111999/4bc71dab72d71d411f3454d3efe32e88/raw/bbe3a47ce801c974bf1cac8d43e5617c24e9c107/gistfile1.txt')
            .then((response) => response.json())
            .then((responseJSON) => {
                result = responseJSON
            })
        return result;
    }
}