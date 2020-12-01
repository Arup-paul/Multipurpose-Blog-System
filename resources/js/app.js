require("./bootstrap");

window.Vue = require("vue");
import { Form, HasError, AlertError } from "vform";

import moment from "moment";

import Gate from "./Gate";
Vue.prototype.$gate = new Gate(window.user);

import VueProgressBar from "vue-progressbar";
Vue.use(VueProgressBar, {
    color: "rgb(143, 255, 199)",
    failedColor: "red",
    height: "2px"
});

//sweet Alert

import Swal from "sweetalert2";
window.Swal = Swal;

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: toast => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
    }
});

window.Toast = Toast;

window.Form = Form;
Vue.component(HasError.name, HasError);
Vue.component(AlertError.name, AlertError);

let Fire = new Vue({});
window.Fire = Fire;

//vue router
import VueRouter from "vue-router";
Vue.use(VueRouter);

const routes = [
    {
        path: "/dashboard",
        component: require("./components/dashboard.vue").default
    },
    {
        path: "/profile",
        component: require("./components/profile.vue").default
    },
    {
        path: "/developer",
        component: require("./components/developer.vue").default
    },
    {
        path: "/users",
        component: require("./components/Users.vue").default
    },
    {
        path: "*",
        component: require("./components/notFound.vue").default
    }
];
const router = new VueRouter({
    mode: "history",
    routes
});

Vue.filter("upText", function(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
});

Vue.filter("myDate", function(created) {
    return moment(created).format("MMMM Do YYYY");
});

Vue.component(
    "example-component",
    require("./components/ExampleComponent.vue").default
);
Vue.component(
    "passport-clients",
    require("./components/passport/Clients.vue").default
);

Vue.component(
    "passport-authorized-clients",
    require("./components/passport/AuthorizedClients.vue").default
);

Vue.component(
    "passport-personal-access-tokens",
    require("./components/passport/PersonalAccessTokens.vue").default
);

Vue.component("notfound", require("./components/notFound").default);

Vue.component("pagination", require("laravel-vue-pagination"));

const app = new Vue({
    el: "#app",
    router,
    data:{
        search: ''
    },
    methods:{
        searchit: _.debounce(() =>{
            Fire.$emit("searching")
        },1000),

        printme(){
            window.print();
        }
    }
});
