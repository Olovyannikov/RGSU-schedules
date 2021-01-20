// jQuery import
import $ from 'jquery';

global.jQuery = $;
global.$ = $;
// end jQuery

import Chart from 'chart.js';

if (document.getElementById('classrooms')) {
    let ctx = document.getElementById('classrooms')
    let myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            datasets: [{
                label: 'Загруженность аудитории в %',
                data: [90, 19, 30, 50, 22, 31, 43, 100, 93, 23, 11, 12],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgb(102,255,140, 0.2)',
                    'rgba(100,30,30, 0.2)',
                    'rgba(159,159,38, 0.2)',
                    'rgba(12,66,174, 0.2)',
                    'rgba(165,86,1, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(102,255,140)',
                    'rgba(100,30,30)',
                    'rgba(159,159,38)',
                    'rgba(12,66,174)',
                    'rgba(165,86,1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

import Vue from 'vue';

const vm = new Vue({
    el: "#app",
    data: {
        keyword:'',
        test: true,
        dataList: [],
        selected: {},
        highlight: 0
    },
    computed: {
        filteredItems() {
            return this.dataList
                .filter(item => {
                    return item.city.toLowerCase().includes(this.keyword.toLowerCase());
                })
                .slice(0, 3);
        }
    },
    methods: {
        onInput(value) {

            if (value === '') this.selected = {};
            if (this.filteredItems.length == 1 && this.highlight) this.highlight = 0;
            this.test = /^[ а-яА-я]/.test(this.keyword);

        },
        onSelect(val) {
            this.selected = val;
            this.keyword = this.selected.city;
            //
            this.highlight = 0;
        },
        moveDown() {
            //this.highlight++
            if (!this.keyword) return;
            this.highlight = (this.highlight + 1) % this.filteredItems.length;
        },
        moveUp() {
            if (!this.keyword) return;
            this.highlight =
                this.highlight - 1 < 0
                    ? this.filteredItems.length - 1
                    : this.highlight - 1;
        },
        mark(word) {
            const regex = new RegExp("(" + this.keyword + ")", "gi");
            return word.replace(regex, "<mark>$1</mark>");
        }
    },
    mounted() {
        fetch("https://gist.githubusercontent.com/gorborukov/0722a93c35dfba96337b/raw/435b297ac6d90d13a68935e1ec7a69a225969e58/russia")
            .then(r => r.json())
            .then(data => (this.dataList = data));
    }
});


