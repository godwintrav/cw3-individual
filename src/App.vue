<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/> -->


    <section id="search-bar">
            <div class="container">
                <div class="row">
                    <div class="col-md-3">
                        <h2>MDX Book Store</h2>
                    </div>
                    <div class="col-md-7">
                        
                            <input class="form-control" type="search" placeholder="Search" aria-label="Search" v-on:keyup="searchLessons" v-model="searchTxt">
                       
                    </div>
                    <div class="col-md-2 cart">
                        <button class="btn btn-1 btn-info" v-bind:disabled="(cartItems.length <= 0)"
                        v-on:click="updateShowProduct"><p class="fa fa-shopping-cart mt-2" style="color: white;"></p> <span
                            style="color: white">{{cartCount()}}</span></button>
                    </div>
                </div>
            </div>
        </section>

        <section id="navigation">
            <div class="container">
                <div class="row">
                    <div class="col-md-12">
                        <p>Home | Store</p>
                    </div>
                </div>
            </div>
        </section>

        <section v-if="showProduct" id="product">
            <Lessons :lessons="lessons" v-on:addLessonToCart="addLessonToCart"></Lessons>
        </section>

        <section v-else id="check-out">
            <div class="container">
                <div v-if="(cartItems.length > 0)" class="row">


                    <div  v-for="(cartItem, index) in cartItems" :key="cartItem.lessonID" class="col-md-4" style="margin-bottom: 20px;">
                        <div class="col-md-12 check-out-1" >
                            <div class="row">
                                <div class="col-md-6 subject-box">
                                    <P>Subject: {{ cartItem.lesson.topic }}<br> Location: {{ cartItem.lesson.location }}<br> Price: <span>&#163;{{ cartItem.lesson.price }}</span><br>  Icon: <span v-bind:class="cartItem.lesson.icon"></span> <br>  Quantity: <span > {{cartItem.space}}</span></P>
                                </div>
                                <div class="col-md-6">
                                    <img v-bind:src="`https://cst3145-cw2-backend.herokuapp.com/${cartItem.lesson.image}`" alt=""
                                        style="width: 100px; height: 100px; margin-top: 20px">
                                </div>
                            </div>
                            <button v-on:click="removeLessonFromCart(index)" type="button" class="btn btn-1 btn-info" style="width: 100%">Remove from
                                Cart</button>
                        </div>
                    </div>

                   

                </div>
            </div>

            <section id="check-out-form">
                <div class="container">
                    <div class="row check-out-row">
                        <div class="col-md-12">
                            
                                <div class="row">
                                    <div class="col">
                                        <input v-on:keyup="validateRegexCheckOut" type="text" class="form-control" placeholder="Enter your full name" v-model="checkOutName" >
                                    </div>
                                    <div class="col">
                                        <input v-on:keyup="validateRegexCheckOut" type="text" class="form-control" placeholder="Enter your mobile number" v-model="checkOutNumber" >
                                    </div>
                                </div>
                                <div class="col-md-12 text-center">
                                    <button v-bind:disabled="cannotCheckOut" v-on:click="checkOut" type="button" class="btn checkout-btn btn-info">Check Out</button>
                                </div>
                           
                        </div>
                    </div>
                </div>
            </section>
            
        </section>
  </div>
</template>

<script>
import Lessons from './components/Lessons.vue'

export default {
  name: 'App',
  components: {
    Lessons
  },
  data() {
    return {

       lessons: [],
      
        cartItems: [

        ],
        showProduct: true,
        searchTxt: '',
        
        checkOutName: '',
        checkOutNumber: '',
        cannotCheckOut: true
    }
  },
  methods: {
    addLessonToCart: function (lessonID, lesson) {
          
            const lessonIndex = this.lessons.findIndex(lesson => lesson._id === lessonID);
            if (lessonIndex != -1) {
                console.log("heeeree");
                this.lessons[lessonIndex].space -= 1;       
            }
             this.addToCart(lessonID, lesson);
        },
        
        updateShowProduct: function () {
            this.showProduct = !this.showProduct;
        },
        addToCart: function (lessonID, lesson) {
          console.log("here");
            const itemIndex = this.cartItems.findIndex(item => item.lessonID === lessonID);
            if (itemIndex != -1) {
                this.cartItems[itemIndex].space += 1;
            } else {
                this.cartItems.push({ lessonID: lessonID, space: 1, lesson: lesson });
            }
        },
        removeLessonFromCart: function (index) {
            this.cartItems[index].space = this.cartItems[index].space - 1;
            const lessonIndex = this.lessons.findIndex(lesson => lesson._id === this.cartItems[index].lessonID);
            if (lessonIndex != -1) {
                this.lessons[lessonIndex].space += 1;
            }
            if (this.cartItems[index].space == 0) {
                this.cartItems.splice(index, 1);
            }

            console.log(this.cartItems);


        },
        cartCount: function(){
            let cartQuantity = 0;
            for (let index = 0; index < this.cartItems.length; index++) {
                cartQuantity += this.cartItems[index].space;
                
            }
            return cartQuantity;
        },
        searchLessons: function () {
            
            fetch("https://cst3145-cw2-backend.herokuapp.com/collection/lessons/" + this.searchTxt).then(
            (response) => {
                response.json().then(
                    (data) => {
                        console.log(data);
                        this.lessons = data;
                        console.log(this.lessons);
                    });
            })
        },
        fetchLesson: function (_id) {
            const lessonIndex = this.lessons.findIndex(lesson => lesson._id === _id);
            if (lessonIndex == -1) {
                return;
            }
            return this.lessons[lessonIndex];
        },
        validateRegexCheckOut: function () {
            var nameRegexPattern = /^[a-zA-Z ]*$/;
            var numberRegexPattern = /^\d+$/;
            if (this.checkOutName.match(nameRegexPattern) && this.checkOutNumber.match(numberRegexPattern)) {
                this.cannotCheckOut = false;
            } else {
                this.cannotCheckOut = true;
            }
        },
        checkOut: function () {
            fetch('https://cst3145-cw2-backend.herokuapp.com/collection/orders', {
                method: 'POST', // set the HTTP method as 'POST'
                headers: {
                    'Content-Type': 'application/json', // set the data type as JSON
                },
                body: JSON.stringify({ name: this.checkOutName, phone: this.checkOutNumber, lessons: this.cartItems }), // need to stringify the JSON object
            })
                .then(response => response.json())
                .then(responseJSON => {
                    console.log('Success:', responseJSON);
                });

            for (let index = 0; index < this.cartItems.length; index++) {
                const lesson = this.fetchLesson(this.cartItems[index].lessonID);
                fetch(`https://cst3145-cw2-backend.herokuapp.com/collection/lessons/${lesson._id}`, {
                    method: 'PUT', // set the HTTP method as 'POST'
                    headers: {
                        'Content-Type': 'application/json', // set the data type as JSON
                    },
                    body: JSON.stringify({ space: lesson.space}), // need to stringify the JSON object
                })
                    .then(response => response.json())
                    .then(responseJSON => {
                        console.log('Success:', responseJSON);
                    });
            }

            this.$swal({
                title: "Check out successful",
                text: "Your order has been submitted",
                icon: "success",
            });
            this.showProduct = true;
            this.cartItems = [];
        }
    },
    
    created: function () {
        fetch("https://cst3145-cw2-backend.herokuapp.com/collection/lessons").then(
             (response) => {
                response.json().then(
                     (data) => {
                        console.log(data);
                        this.lessons = data;
                        console.log(this.lessons + "Fetched");
                    });
            })
    }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
