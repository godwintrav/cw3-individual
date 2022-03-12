let store = new Vue({
    el: '#app',
    data: {
        lessons: [],
        cartItems: [

        ],
        showProduct: true,
        searchTxt: '',
        order: 'asc',
        attribute: 'subject',
        sortOrders: {
            Ascending: 'asc',
            Descending: 'desc'
        },
        sortAttributes: {
            Subject: 'subject',
            Location: 'location',
            Price: 'price',
            Spaces: 'spaces'
        },
        checkOutName: '',
        checkOutNumber: '',
        cannotCheckOut: true
    },
    methods: {
        addLessonToCart: function (_id) {
            const lessonIndex = this.lessons.findIndex(lesson => lesson._id === _id);
            if (lessonIndex != -1) {
                this.lessons[lessonIndex].space -= 1;
                this.addToCart(_id);
            }

        },
        updateShowProduct: function () {
            this.showProduct = !this.showProduct;
        },
        addToCart: function (lessonID) {
            const itemIndex = this.cartItems.findIndex(item => item.lessonID === lessonID);
            if (itemIndex != -1) {
                this.cartItems[itemIndex].space += 1;
            } else {
                this.cartItems.push({ lessonID: lessonID, space: 1 });
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
            function (response) {
                response.json().then(
                    function (data) {
                        console.log(data);
                        store.lessons = data;
                        console.log(store.lessons);
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
            var nameRegexPattern = /^[a-zA-Z ]*$/;;
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

            swal({
                title: "Check out successful",
                text: "Your order has been submitted",
                icon: "success",
            });
            this.showProduct = true;
            this.cartItems = [];
        }
    },
    computed: {
        sortedLessons() {
            function compareSubjectAsc(a, b) {
                if (a.subject > b.subject) return 1;
                if (a.subject < b.subject) return -1;
                return 0;
            }
            function compareSubjectDesc(a, b) {
                if (a.subject > b.subject) return -1;
                if (a.subject < b.subject) return 1;
                return 0;
            }

            function compareLocationAsc(a, b) {
                if (a.location > b.location) return 1;
                if (a.location < b.location) return -1;
                return 0;
            }
            function compareLocationDesc(a, b) {
                if (a.location > b.location) return -1;
                if (a.location < b.location) return 1;
                return 0;
            }

            function comparePriceAsc(a, b) {
                if (a.price > b.price) return 1;
                if (a.price < b.price) return -1;
                return 0;
            }
            function comparePriceDesc(a, b) {
                if (a.price > b.price) return -1;
                if (a.price < b.price) return 1;
                return 0;
            }

            function compareSpacesAsc(a, b) {
                if (a.space > b.space) return 1;
                if (a.space < b.space) return -1;
                return 0;
            }
            function compareSpacesDesc(a, b) {
                if (a.space > b.space) return -1;
                if (a.space < b.space) return 1;
                return 0;
            }

            if (this.order == "asc") {
                if (this.attribute == "subject") {
                    return this.lessons.sort(compareSubjectAsc);
                } else if (this.attribute == "location") {
                    return this.lessons.sort(compareLocationAsc);
                } else if (this.attribute == "price") {
                    return this.lessons.sort(comparePriceAsc);
                } else {
                    return this.lessons.sort(compareSpacesAsc);
                }

            } else {
                if (this.attribute == "subject") {
                    return this.lessons.sort(compareSubjectDesc);
                } else if (this.attribute == "location") {
                    return this.lessons.sort(compareLocationDesc);
                } else if (this.attribute == "price") {
                    return this.lessons.sort(comparePriceDesc);
                } else {
                    return this.lessons.sort(compareSpacesDesc);
                }
            }
        }
    },
    created: function () {
        fetch("https://cst3145-cw2-backend.herokuapp.com/collection/lessons").then(
            function (response) {
                response.json().then(
                    function (data) {
                        console.log(data);
                        store.lessons = data;
                        console.log(store.lessons);
                    });
            })
    }

});