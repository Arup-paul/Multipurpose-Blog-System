<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12 mt-3">
        <div class="card card-widget widget-user">
          <!-- Add the bg color to the header using any of the bg-* classes -->
          <div
            class="widget-user-header text-white"
            style="background: url('images/user-cover.png') center center"
          >
            <h3 class="widget-user-username text-right">{{this.form.name}}</h3>
            <h5 class="widget-user-desc text-right">{{ this.form.type }}</h5>
          </div>
          <div class="widget-user-image">
            <img class="img-circle" :src="getProfilePhoto()" alt="User Avatar" />
          </div>
          <div class="card-footer">
            <div class="row">
              <div class="col-sm-4 border-right">
                <div class="description-block">
                  <h5 class="description-header">3,200</h5>
                  <span class="description-text">SALES</span>
                </div>
                <!-- /.description-block -->
              </div>
              <!-- /.col -->
              <div class="col-sm-4 border-right">
                <div class="description-block">
                  <h5 class="description-header">13,000</h5>
                  <span class="description-text">FOLLOWERS</span>
                </div>
                <!-- /.description-block -->
              </div>
              <!-- /.col -->
              <div class="col-sm-4">
                <div class="description-block">
                  <h5 class="description-header">35</h5>
                  <span class="description-text">PRODUCTS</span>
                </div>
                <!-- /.description-block -->
              </div>
              <!-- /.col -->
            </div>
            <!-- /.row -->
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-12 mt-3">
        <div class="card">
          <div class="card-header p-2">
            <ul class="nav nav-pills">
              <li class="nav-item">
                <a class="nav-link" href="#activity" data-toggle="tab"
                  >Activity</a
                >
              </li>
              <li class="nav-item">
                <a class="nav-link active" href="#settings" data-toggle="tab"
                  >Settings</a
                >
              </li>
            </ul>
          </div>
          <!-- /.card-header -->
          <div class="card-body">
            <div class="tab-content">
              <div class="tab-pane" id="activity">
                <!-- Post -->
                <div class="post">
                  <h1>display user activity</h1>
                </div>
                <!-- /.post -->
              </div>

              <div class="tab-pane active" id="settings">
                <form class="form-horizontal">
                  <div class="form-group row">
                    <label for="inputName" class="col-sm-3 col-form-label"
                      >Name</label
                    >
                    <div class="col-sm-9">
                      <input
                      v-model="form.name"
                      name="name"
                        type="text"
                        class="form-control"
                        id="inputName"
                        placeholder="Name"
                        :class="{ 'is-invalid': form.errors.has('name') }"
                      />
                      <has-error :form="form" field="name"></has-error>
                    </div>
                  </div>
                  <div class="form-group row">
                    <label for="inputName" class="col-sm-3 col-form-label"
                      >Email</label
                    >
                    <div class="col-sm-9">
                      <input
                       v-model="form.email"
                      name="email"
                        type="email"
                        class="form-control"
                        id="inputName"
                        placeholder="Email"
                        :class="{ 'is-invalid': form.errors.has('email') }"
                      />
                      <has-error :form="form" field="email"></has-error>
                    </div>
                  </div>
                  <div class="form-group row">
                    <label for="inputExperience" class="col-sm-3 col-form-label"
                      >Experience</label
                    >
                    <div class="col-sm-9">
                      <textarea
                       v-model="form.bio"
                      name="bio"
                        class="form-control"
                        id="inputExperience"
                        placeholder="Experience"
                      ></textarea>
                    </div>
                  </div>
                  <div class="form-group row">
                    <label for="inputSkills" class="col-sm-3 col-form-label"
                      >Profile Photo</label
                    >
                    <div class="col-sm-9">
                      <input
                        type="file"
                        @change="updateProfile"
                        class="form-control"
                        id="inputSkills"
                        placeholder="photo"
                      />
                    </div>
                  </div>

                  <div class="form-group row">
                    <label for="inputSkills" class="col-sm-3 col-form-label"
                      >password <br />
                      <small>(leave empty is not changing)</small></label
                    >
                    <div class="col-sm-9">
                      <input
                        v-model="form.password"
                         name="password"
                        type="password"
                        class="form-control"
                        id="inputName"
                        placeholder="password"
                        :class="{ 'is-invalid': form.errors.has('password') }"
                      />
                       <has-error :form="form" field="password"></has-error>
                    </div>
                  </div>

                  <div class="form-group row">
                    <div class="offset-sm-3 col-sm-9">
                      <button @click.prevent="updateInfo" type="submit" class="btn btn-success">
                        Submit
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <!-- /.tab-pane -->
            </div>
            <!-- /.tab-content -->
          </div>
          <!-- /.card-body -->
        </div>
        <!-- /.nav-tabs-custom -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: new Form({
        id: "",
        name: "",
        email: "",
        password: "",
        type: "",
        bio: "",
        photo: "",
      }),
    };
  },
  mounted() {
    console.log("Component mounted.");
  },
  methods:{

      getProfilePhoto(){
          let photo = (this.form.photo.length > 200) ? this.form.photo : "images/profile/"+ this.form.photo ;
           return photo;
      },
    updateInfo(){
        this.$Progress.start();
      this.form.put('api/profile/')
      .then(() => {
           Fire.$emit("AfterCreate", true);
            Toast.fire({
            icon: "success",
            title: "Profile updated successfully",
          });
       this.$Progress.finish();
      })
      .catch(() => {
         this.$Progress.fail();
      })

    },
   updateProfile(e){
      let file = e.target.files[0];
      console.log(file);
      let reader = new FileReader();

       if(file['size'] < 2111775){
           reader.onloadend = (file) => {
            // console.log('RESULT',reader.result)
            this.form.photo = reader.result
      }
       reader.readAsDataURL(file);
      }else{
           Toast.fire({
            icon: "error",
            title: "You are Uploading a large file ",
          });
      }





   }
  },

  created() {
    axios.get('api/profile')
    .then(({data}) => (this.form.fill(data)));
  },
};
</script>

<style>
.widget-user .widget-user-header {
  height: 250px;
  background-position: center center;
  background-size: cover;
}
</style>
