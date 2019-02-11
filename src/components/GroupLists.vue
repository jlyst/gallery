<template>
    <div class="page-container">
        <div class="page">
            <h1>Admin Classes <div class="button" v-on:click="purge($event)">Purge Stale Codes ({{studentCodes.length + teacherCodes.length + companyCodes.length}})</div>
            </h1>
            <h2>Add a Class</h2>
            <div>
                <div>Name</div>
                <input ref="newClassName">
                <div>Student Code</div>
                <input ref="newClassStudentCode">
                <div>Teacher Code</div>
                <input ref="newClassTeacherCode">
                <div class="button" v-on:click="addClass($event)">Add Class</div>
                <hr>
            </div>
            <h2>Current Classes</h2>
            <div v-for="(cls, idx) in classesPlus">
                <div>Name</div>
                <input ref="name" :value="cls.name">
                <div>Student Code</div>
                <input ref="studentCode" :value="cls.studentCode">
                <div>Teacher Code</div>
                <input ref="teacherCode" :value="cls.teacherCode">
                <div v-on:click="updateClass(cls.id, idx, $event)" class="button">Update Class</div>
                <div class="button" v-on:click="deleteClass(cls.id, idx, $event)">Delete Class</div>
                <div><small>ID: {{cls.id}}</small></div>
                <hr>
            </div>
            <!--                -->
            <h1>Admin Companies</h1>
            <h2>Add a Company</h2>
            <div>
                <div>Name</div>
                <input ref="newCompanyName">
                <div >Company Code</div>
                <input ref="newCompanyCode">
                <br>
                <div class="button" v-on:click="addCompany($event)">Add Company</div>
                <hr>
            </div>
            <h2>Current Companies</h2>
            <div v-for="(cmp, idx) in companiesPlus">
                <div>Name</div>
                <input ref="cname" :value="cmp.name">
                <div>Company Code</div>
                <input ref="companyCode" :value="cmp.companyCode">
                <div class="button" v-on:click="updateCompany(cmp.id, idx, $event)">Update Company</div>
                <div class="button" v-on:click="deleteCompany(cmp.id, idx, $event)">Delete Company</div>
                <div><small>ID: {{cmp.id}}</small></div>
                <hr>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        db,
        user,
        fs
    } from '../main'
    export default {
        name: 'GroupLists',
        data() {
            return {
                newClass: {},
                newCompany: {},
                classes: [],
                classesPlus: [],
                companies: [],
                companiesPlus: [],
                studentCodes: [],
                teacherCodes: [],
                companyCodes: []
            }
        },
        created: function(){
            document.title = "Manage Groups";
        },
        methods: {
            copyDataArray: function(d) {
                var arr = [];
                d.forEach(i => {
                    var newItem = {
                        id: i.id
                    };
                    Object.keys(i).forEach(p => {
                        newItem[p] = i[p];
                    });
                    arr.push(newItem);
                });
                return arr;
            },
            purge: function(ev) {
                //ev.target.setAttribute("style", "pointer-events:none");
                //ev.target.innerHTML = "purging...";
                var arr = this.copyDataArray(this.classes);
                //                console.log(this.classes,arr);
                this.studentCodes.forEach(scode => {
                    if(scode.id=="null") db.collection('studentCodes').doc(scode.id).delete();
                    var i = arr.findIndex(c => c.id == scode.classid);
                    if (i == -1) {
                        db.collection('studentCodes').doc(scode.id).delete();
                    } else {
                        if (arr[i].studentCode) {
                            db.collection('studentCodes').doc(arr[i].studentCode).delete();
                            arr[i].studentCode = scode.id;
                        } else arr[i].studentCode = scode.id;
                    }
                });
                this.teacherCodes.forEach(scode => {
                    if(scode.id=="null") db.collection('teacherCodes').doc(scode.id).delete();
                    var i = arr.findIndex(c => c.id == scode.classid);
                    if (i == -1) {
                        db.collection('teacherCodes').doc(scode.id).delete();
                    } else {
                        if (arr[i].teacherCode) {
                            db.collection('teacherCodes').doc(arr[i].teacherCode).delete();
                            arr[i].teacherCode = scode.id;
                        } else arr[i].teacherCode = scode.id;
                    }
                });
                var arr2 = this.copyDataArray(this.companies);
                this.companyCodes.forEach(scode => {
                    if(scode.id=="null") db.collection('companyCodes').doc(scode.id).delete();
                    var i = arr2.findIndex(c => c.id == scode.companyID);
                    if (i == -1) {
                        db.collection('companyCodes').doc(scode.id).delete();
                    } else {
                        if (arr2[i].companyCode) {
                            db.collection('companyCodes').doc(arr2[i].companyCode).delete();
                            arr2[i].companyCode = scode.id;
                        } else arr2[i].companyCode = scode.id;
                    }
                });
                //ev.target.innerHTML = "Purge Stale Codes";
            },
            processClasses: function() {
                var arr = this.copyDataArray(this.classes);
                //console.log("arr: ",arr);
                this.studentCodes.forEach(scode => {
                    var i = arr.findIndex(c => c.id == scode.classid);
                    if (i > -1) arr[i].studentCode = scode.id;
                });
                this.teacherCodes.forEach(scode => {
                    var i = arr.findIndex(c => c.id == scode.classid);
                    if (i > -1) arr[i].teacherCode = scode.id;
                });
                this.classesPlus = arr.slice(0);
                //console.log("Classes: ",this.classes);
            },
            processCompanies: function() {
                var arr = this.copyDataArray(this.companies);
                this.companyCodes.forEach(scode => {
                    var i = arr.findIndex(c => c.id == scode.companyID);
                    if (i > -1) arr[i].companyCode = scode.id;
                });
                this.companiesPlus = arr.slice(0);

            },
            updateClass: function(id, idx, ev) {
                //                console.log(this.classes);
                var self = this;
                var sCode = self.$refs.studentCode[idx].value;
                var tCode = self.$refs.teacherCode[idx].value;
                ev.target.setAttribute("style", "pointer-events:none");
                ev.target.innerHTML = "updating...";
                db.collection('classes').doc(id)
                    .set({
                        name: self.$refs.name[idx].value,
                        timestamp: fs.FieldValue.serverTimestamp()
                    })
                    .then(function() {
                        self.setClassCodes(id, sCode, tCode);
                        reset();
                        //                        if (sCode)
                        //                            db.collection('studentCodes').doc(sCode)
                        //                            .set({
                        //                                classid: id
                        //                            })
                        //                            .then(function() {
                        //                                if (tCode)
                        //                                    db.collection('teacherCodes').doc(tCode)
                        //                                    .set({
                        //                                        classid: id
                        //                                    })
                        //                                    .then(function() {
                        //                                        reset();
                        //                                    });
                        //                                else {
                        //                                    reset();
                        //                                }
                        //                            });
                        //                        else {
                        //                            reset();
                        //                        }
                    });

                function reset() {
                    ev.target.setAttribute("style", "pointer-events:auto");
                    ev.target.innerHTML = "Update Class";
                }

            },
            updateCompany: function(id, idx, ev) {
                //                console.log(this.classes);
                var self = this;
                var cCode = self.$refs.companyCode[idx].value;
                ev.target.setAttribute("style", "pointer-events:none");
                ev.target.innerHTML = "updating...";
                db.collection('companies').doc(id)
                    .set({
                        name: self.$refs.cname[idx].value,
                        timestamp: fs.FieldValue.serverTimestamp()
                    })
                    .then(function() {
                        self.setCompanyCode(id, cCode);
                        reset();
                    });

                function reset() {
                    ev.target.setAttribute("style", "pointer-events:auto");
                    ev.target.innerHTML = "Update Company";
                }

            },
            addClass: function(ev) {
                var newC = {};
                newC.name = this.$refs.newClassName.value;
                newC.timestamp = fs.FieldValue.serverTimestamp();
                var tCode = this.$refs.newClassTeacherCode.value;
                var sCode = this.$refs.newClassStudentCode.value;
                
                ev.target.setAttribute("style", "pointer-events:none");
                ev.target.innerHTML = "saving...";
                db.collection('classes').add(newC).then((docRef) => {
                    var id = docRef.id;
                    this.setClassCodes(id, sCode, tCode);
                    reset(this);
                });

                function reset(self) {
                    ev.target.setAttribute("style", "pointer-events:auto");
                    ev.target.innerHTML = "Add Class";
                    self.$refs.newClassName.value = "";
                    self.$refs.newClassTeacherCode.value = "";
                    self.$refs.newClassStudentCode.value = "";
                }
            },
            addCompany: function(ev) {
                var newC = {};
                newC.name = this.$refs.newCompanyName.value;
                newC.timestamp = fs.FieldValue.serverTimestamp();
                var cCode = this.$refs.newCompanyCode.value;
                ev.target.setAttribute("style", "pointer-events:none");
                ev.target.innerHTML = "saving...";
                db.collection('companies').add(newC).then((docRef) => {
                    var id = docRef.id;
                    this.setCompanyCode(id, cCode);
                    reset(this);
                });

                function reset(self) {
                    ev.target.setAttribute("style", "pointer-events:auto");
                    ev.target.innerHTML = "Add Company";
                    self.$refs.newCompanyName.value = "";
                    self.$refs.newCompanyCode.value = "";
                }
            },
            setCompanyCode: function(id, cCode) {
                if (cCode)
                    db.collection('companyCodes').doc(cCode)
                    .set({
                        companyID: id,
                        timestamp: fs.FieldValue.serverTimestamp()
                    })
                    .then(function() {
                        //reset();
                    });
            },
            setClassCodes: function(id, sCode, tCode) {
                if (sCode)
                    db.collection('studentCodes').doc(sCode)
                    .set({
                        classid: id,
                        timestamp: fs.FieldValue.serverTimestamp()
                    })
                    .then(function() {
                        if (tCode)
                            db.collection('teacherCodes').doc(tCode)
                            .set({
                                classid: id,
                                timestamp: fs.FieldValue.serverTimestamp()
                            })
                            .then(function() {
                                //reset();
                            });
                        else {
                            //reset();
                        }
                    });
                else {
                    //reset();
                }
            },
            deleteClass: function(id, idx, ev) {
                var r = confirm("This will forever delete this group and private gallaries, but will not remove the associated posts!");
                if (r == true) {
                    ev.target.setAttribute("style", "pointer-events:none");
                    ev.target.innerHTML = "deleting...";
//                    var sCode = this.$refs.studentCode[idx].value;
//                    var tCode = this.$refs.teacherCode[idx].value;
                    if (id) {
                        console.log('deleting ', this.$refs.name[idx].value);
                        db.collection("classes").doc(id).delete();
//                        db.collection("studentCodes").doc(sCode).delete();
//                        db.collection("teacherCodes").doc(tCode).delete();
                        //this.$router.push(`/`);
                    }
                }
            },
            deleteCompany: function(id, idx, ev) {
                var r = confirm("This will forever delete this group, but will not remove the associated comments!");
                if (r == true) {
                    ev.target.setAttribute("style", "pointer-events:none");
                    ev.target.innerHTML = "deleting...";
                    if (id) {
                        console.log('deleting');
                        db.collection("companies").doc(id).delete();
                        //this.$router.push(`/`);
                    }
                }
            }
        },
        watch: {
            classes: function() {
                this.processClasses()
            },
            studentCodes: function() {
                this.processClasses()
            },
            teacherCodes: function() {
                this.processClasses()
            },
            companies: function() {
                this.processCompanies()
            },
            companyCodes: function() {
                this.processCompanies()
            }
        },
        firestore() {
            return {
                classes: db.collection('classes').orderBy('name', 'asc'),
                companies: db.collection('companies'),
                studentCodes: db.collection('studentCodes').orderBy('timestamp', 'asc'),
                teacherCodes: db.collection('teacherCodes').orderBy('timestamp', 'asc'),
                companyCodes: db.collection('companyCodes').orderBy('timestamp', 'asc')
            }
        }
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    input:not([type]),
    input[type="text"],
    textarea {
        display: block;
        outline: none;
        font-size: 18px;
        border: 1px solid #aaa;
        border-radius: 3px;
        width: 100%;
        max-width: 550px;
        padding: 5px;
        box-sizing: border-box;
        margin: 3px 0;
        background-color: #fff;
    }

</style>
