import Vue from 'vue';

export default () => {
    const vm = new Vue({
        el: "#app",
        data: {
            keyword: '',
            test: true,
            dataList: [],
            selected: {},
            highlight: 0
        },
        computed: {
            filteredItems() { 
                return this.dataList
                    .filter(item => {
                        return this.keyword !== undefined ? item.name.toLowerCase().includes(this.keyword.toLowerCase()) : '';
                    })
                    .slice(0, 3);
            }
        },
        methods: {
            onList(val) {
                this.selected = val;
            }, 
            onInput(value) {

                if (value === '') this.selected = {};
                if (this.filteredItems.length == 1 && this.highlight) this.highlight = 0; 
                //this.test = /^[ а-яА-я]/.test(this.keyword);
            },
            onSelect(val) {
                this.selected = val;
                this.keyword = this.selected.name;
                this.highlight = 0;
            },
            onClick(val){
                console.log("SEND GUID: " + val.guid);
                this.onSelect({'name': val.name});
                fetch(`send.php?action=getTestSchedule&param=${val.guid}`)
                .then(data => data.text()) 
                .then(response => {
                    console.log("Ответ от сервера:");
                    document.querySelector('.card__table').innerHTML = response;
                }); 
            },
            
            moveDown() {
                if (!this.keyword) return;
                this.highlight = (this.highlight + 1) % this.filteredItems.length;
            },
            moveUp() {
                if (!this.keyword) return;
                this.highlight =
                    this.highlight - 1 < 0
                        ? this.filteredItems.length - 1 
                        : this.highlight - 1;
            } 
        },
        mounted() {
            fetch("send.php?action=getGroup")
                .then(r => r.json())
                .then(data => (this.dataList = data.data));
        }
    });
}
