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
                        return this.keyword !== undefined ? item.city.toLowerCase().includes(this.keyword.toLowerCase()) : '';
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
                this.keyword = this.selected.city + ', ' + this.selected.region;
                this.highlight = 0; 
            },
            onClick(val){
                console.log(`...../..../../?action=getSchedule&cptl=students&param=${val}`); 
                this.onSelect({'city': val});
                fetch(`...../..../../?action=getSchedule&cptl=students&param=${val}`, {
                    method : 'GET'
                }).then(data => data.json()).then(response => console.log(response)); 
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
            fetch("https://gist.githubusercontent.com/gorborukov/0722a93c35dfba96337b/raw/435b297ac6d90d13a68935e1ec7a69a225969e58/russia")
                .then(r => r.json())
                .then(data => (this.dataList = data));
        }
    });
}
