<template>
  <div id="app">


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
            <Lessons :lessons="lessons" v-on:addLesson="addLessonToCart"></Lessons>
        </section>

        <section v-else id="check-out">
            <Checkout :cartItems="cartItems" v-on:removeLesson="removeLessonFromCart" v-on:checkOut="checkOut"></Checkout>
            
        </section>
  </div>
</template>

<script>
import Lessons from './components/Lessons.vue'
import Checkout from './components/Checkout.vue'

export default {
  name: 'App',
  components: {
    Lessons,
    Checkout
  },
  data() {
    return {

       lessons: [],
      
        cartItems: [

        ],
        showProduct: true,
        searchTxt: '',
        
        
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

            if(this.cartItems.length == 0){
              this.showProduct = true;
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
        checkOut: function (checkOutName, checkOutNumber) {
            fetch('https://cst3145-cw2-backend.herokuapp.com/collection/orders', {
                method: 'POST', // set the HTTP method as 'POST'
                headers: {
                    'Content-Type': 'application/json', // set the data type as JSON
                },
                body: JSON.stringify({ name: checkOutName, phone: checkOutNumber, lessons: this.cartItems }), // need to stringify the JSON object
            })
                .then(response => response.json())
                .then(responseJSON => {
                    console.log('Success:', responseJSON);
                });

            for (let index = 0; index < this.cartItems.length; index++) {
                const lesson = this.cartItems[index].lesson;
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
            // alert("Check out successful\nYour order has been submitted");
            this.showProduct = true;
            this.cartItems = [];
            this.$swal({
                title: "Check out successful",
                text: "Your order has been submitted",
                icon: "success",
            });
            
        },
        fetchLesson: function (_id) {
            const lessonIndex = this.lessons.findIndex(lesson => lesson._id === _id);
            if (lessonIndex == -1) {
                return;
            }
            return this.lessons[lessonIndex];
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
