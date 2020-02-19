'use strict'
//const proxyUrl = 'https://cors-anywhere.herokuapp.com/'
// const targetUrl = 'http://z.bokus.ru/user.json';

/**
 * компонент Строка таблицы
 * rowItem (Object) - содержит элемент массива - объект с данными о содержимом строки
 */
const tableRow = {
    name: "table-row", 
    props: ['rowItem'],
    template: `<tr><td :class="[rowItem.isDelimiter ? 'table__delimiter' : 'table__cell--bold']">{{rowItem.name}}</td>
                    <td :class="[rowItem.isDelimiter ? 'table__delimiter' : 'table__cell--bold']">{{rowItem.old}}</td>
                    <td :class="[rowItem.isDelimiter ? 'table__delimiter' : 'table__cell']">{{rowItem.title}}</td>
                    <td :class="[rowItem.isDelimiter ? 'table__delimiter' : 'table__cell']">{{rowItem.year}}</td>
                </tr>`,
    
};

/**
 * компонент Заголовок таблицы
 */
const tableHeader ={
    name: "table-header", 
    data: () => ({
            userNameTitle: "Автор",
            userAgeTitle: "Возраст",
            bookTitleTitle: "Название",
            bookYearTitle: "Год"
        }),

    template: `<tr><th class="table__header">{{userNameTitle}}</th>
                   <th class="table__header">{{userAgeTitle}}</th>
                   <th class="table__header">{{bookTitleTitle}}</th>
                   <th class="table__header">{{bookYearTitle}}</th>
                </tr>`,
};
/**
 * компонент Таблица
 */
const userTable = {
    name: "user-table",
    components: {
        tableHeader,
        tableRow,
    },
    data: () => ({
        jsonData: {user:{}, book: {}},
    }),
    
    template: `<table class="table">
                    <table-header />
                    <table-row v-for="tableItem in tableArray" 
                        :rowItem="tableItem"    
                        :key="tableItem.key"/>
               </table>`,
    methods: {
        makeGETRequest(url){
            return new Promise((resolve, reject) => {
                let xhr;
                if (window.XMLHttpRequest) {
                    xhr = new window.XMLHttpRequest();
                } else {
                    xhr = new window.ActiveXObject('Microsoft.XMLHTTP');
                }
                //xhr.withCredentials = true;
                xhr.onreadystatechange=function(){
                    console.log('xhr.readyState=', xhr.readyState); 
                    console.log('xhr.status=', xhr.status); 
                    if (xhr.readyState === 4){
                        if (xhr.status === 200) {
                            const body = JSON.parse(xhr.responseText);
                            resolve(body);
                        } else{
                            reject({error: xhr.status});
                        }
                    }
                };
                xhr.onerror=(err)=>{reject(err)};
                xhr.open('GET', url);
                xhr.send();
            });
        },
    },
    async mounted(){
        this.makeGETRequest(`/data`).then((data)=>{
            this.jsonData = data;
        }).catch((err)=>{
            console.error(err);
        });
    },
    computed: {
        tableArray(){
            const tmpArr = [];
            const {user, book} = this.jsonData;
            let tmpKey=0;
            Object.values(user).forEach((userItem) => {
                const tmpUser = {};
                tmpUser.uid = userItem.uid;
                let tmpBook = Object.values(book).filter(bookItem => bookItem.uid === tmpUser.uid);
                //console.log(tmpUser.uid, userItem)
                Object.values(tmpBook).forEach((userBook, ix) => {
                    tmpUser.key = tmpKey;
                    if (ix === 0){
                        tmpUser.name = userItem.name;
                        tmpUser.old = userItem.old;
                    } else {
                        tmpUser.name = "";
                        tmpUser.old = "";
                    }
                    tmpUser.title = userBook.title;
                    tmpUser.year = userBook.year;
                    tmpArr.push({...tmpUser});
                    tmpKey++;
                });
                tmpArr.push({name:"", old: "", title: "", year: "", key: tmpKey, isDelimiter: true});
                tmpKey++;
            });
            return tmpArr;
        }
    },
};

const app = new Vue({
    el: '#app',
    components: {
        userTable
    }
    
})