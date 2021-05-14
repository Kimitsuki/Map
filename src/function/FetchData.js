export const FetchData = {
    async data() {
        var result = [];
        await fetch('https://gist.githubusercontent.com/dung111999/4bc71dab72d71d411f3454d3efe32e88/raw/a50913fe5ce4ca7159aa35986907d2c3fdf7aadf/gistfile1.txt')
            .then((response) => response.json())
            .then((responseJSON) => {
                result = responseJSON
            })
        return result;
    }
}
// https://gist.githubusercontent.com/dung111999/4bc71dab72d71d411f3454d3efe32e88/raw/a50913fe5ce4ca7159aa35986907d2c3fdf7aadf/gistfile1.txt
// https://gist.githubusercontent.com/Kimitsuki/3e2ebbcdb3fd75a3f956a7d30eeaa048/raw/6b1ffeb2bc1253df68469300d93ec86158bea60b/poi.js