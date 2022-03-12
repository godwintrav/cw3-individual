<template>

      <div class="container">
                <div class="row">
                    <div class="col-md-2">
                        <div class="dropdown show drop-down-1">
                            <p>Sort by</p>
                            <select class="btn select-btn-1 btn-info dropdown-toggle" style="width: 100%"  v-model="attribute">
                                <option v-for="(sortAttribute, key) in sortAttributes" :key="sortAttribute" v-bind:value="sortAttribute">{{ key }}</option>
                            </select>

                        </div>

                        <div class="dropdown show drop-down-2">
                            <select class="btn select-btn-2 btn-info dropdown-toggle" style="width: 100%" v-model="order">
                                <option v-for="(sortOrder, key) in sortOrders" :key="sortOrder" v-bind:value="sortOrder">{{ key }}</option>
                            </select>
                        </div>
                    </div>
                   <div class="col-md-10">
                      
                        <div v-if="(lessons.length > 0)" class="row grid-1">

                            
                            <div v-for="(lesson) in sortedLessons" :key="lesson.id" class="col-md-4" style="margin-bottom: 20px;">
                                <div class="col-md-12 subject-1">
                                    <div class="row">
                                        <div class="col-md-6 subject-box">
                                            <P>Subject: {{lesson.topic}}<br> Location: {{lesson.location}}<br> Price: <span>&#163;{{lesson.price}}</span><br>
                                                Spaces: {{lesson.space}} <br>  Icon: <span v-bind:class="lesson.icon"></span></P>
                                                
                                               
                                        </div>
                                        <div class="col-md-6">
                                            <img v-bind:src="`https://cst3145-cw2-backend.herokuapp.com/${lesson.image}`" alt=""
                                                style="width: 100px; height: 100px; margin-top: 20px">
                                        </div>
                                    </div>
                                    <button v-bind:disabled="(lesson.space <= 0)" v-on:click="addLessonToCart(lesson._id, lesson)" type="button" class="btn btn-1 btn-info" style="width: 100%">Add to
                                        Cart</button>
                                </div>
                            </div>
                            

                           

                        </div>
                        <div v-else class="row grid-1">
                            <p style="margin: auto;">No result found</p>
                        </div>
                    </div>
                </div>

            </div>
    
</template>

<script>

export default {
    name: 'Lessons',
    props: ['lessons'],
    methods: {
        addLessonToCart: function (lessonID, lesson) {
             this.$emit('addLessonToCart', lessonID, lesson);
        },
    },
    data() {
        return {
           
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
                  // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                    return this.lessons.sort(compareSubjectAsc);
                } else if (this.attribute == "location") {
                  // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                    return this.lessons.sort(compareLocationAsc);
                } else if (this.attribute == "price") {
                  // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                    return this.lessons.sort(comparePriceAsc);
                } else {
                  // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                    return this.lessons.sort(compareSpacesAsc);
                }

            } else {
                if (this.attribute == "subject") {
                  // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                    return this.lessons.sort(compareSubjectDesc);
                } else if (this.attribute == "location") {
                  // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                    return this.lessons.sort(compareLocationDesc);
                } else if (this.attribute == "price") {
                  // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                    return this.lessons.sort(comparePriceDesc);
                } else {
                  // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                    return this.lessons.sort(compareSpacesDesc);
                }
            }
        }
    },
}
</script>
