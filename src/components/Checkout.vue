<template>
     <div>
         <div class="container">
                <div v-if="(cartItems.length > 0)" class="row">


                    <div  v-for="(cartItem, index) in cartItems" :key="cartItem.lessonID" class="col-md-4" style="margin-bottom: 20px;">
                        <div class="col-md-12 check-out-1" >
                            <div class="row">
                                <div class="col-md-6 subject-box">
                                    <p>Subject: {{ cartItem.lesson.topic }}<br> Location: {{ cartItem.lesson.location }}<br> Price: <span>&#163;{{ cartItem.lesson.price }}</span><br>  Icon: <span v-bind:class="cartItem.lesson.icon"></span> <br>  Quantity: <span > {{cartItem.space}}</span></p>
                                </div>
                                <div class="col-md-6">
                                    <img v-bind:src="`https://cst3145-cw2-backend.herokuapp.com/${cartItem.lesson.image}`" alt=""
                                        style="width: 100px; height: 100px; margin-top: 20px">
                                </div>
                            </div>
                            <button v-on:click="removeLesson(index)" type="button" class="btn btn-1 btn-info" style="width: 100%">Remove from
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
                                    <button v-bind:disabled="cannotCheckOut" v-on:click="checkOut(checkOutName, checkOutNumber)" type="button" class="btn checkout-btn btn-info">Check Out</button>
                                </div>
                           
                        </div>
                    </div>
                </div>
            </section>
     </div>
</template>

<script>
export default {
    name: 'Checkout',
    props: ['cartItems'],
    data() {
        return {
            checkOutName: '',
        checkOutNumber: '',
        cannotCheckOut: true
        }
    },
    methods: {
        removeLesson: function(index){
             this.$emit('removeLesson', index);
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
        checkOut: function (checkOutName, checkOutNumber) {   
             this.$emit('checkOut',checkOutName, checkOutNumber);
        }
    }
}
</script>