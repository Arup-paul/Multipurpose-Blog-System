<template>
  <div class="container">
    <div class="row mt-5" v-if="$gate.isAdminOrAuthor()">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">All Users</h3>

            <div class="card-tools">
              <button class="btn btn-success" @click="newModal">
                <i class="fas fa-user-plus"></i> Add New
              </button>
            </div>
          </div>
          <!-- /.card-header -->
          <div class="card-body table-responsive p-0">
            <table class="table table-hover text-nowrap">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Type</th>
                  <th>Registered At</th>
                  <th>Modify</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users.data" :key="user.id">
                  <td>{{ user.id }}</td>
                  <td>{{ user.name }}</td>
                  <td>{{ user.email }}</td>
                  <td>{{ user.type | upText }}</td>
                  <td>{{ user.created_at | myDate }}</td>
                  <td>
                    <a @click="editModal(user)" class="btn btn-info btn-sm"
                      ><i class="fas fa-edit"></i> Edit</a
                    >
                    <a
                      @click="deleteUser(user.id)"
                      class="btn btn-danger btn-sm"
                      ><i class="fas fa-trash"></i> Delete</a
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- /.card-body -->
          <div class="card-footer">
              <pagination :data="users" @pagination-change-page="getResults"></pagination>
          </div>
        </div>
        <!-- /.card -->
      </div>
    </div>
    <div v-if="!$gate.isAdminOrAuthor()">
      <notfound></notfound>
    </div>

    <!-- Modal -->
    <div
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content bg-primary">
          <div class="modal-header">
            <h5 v-if="!editMode" class="modal-title" id="exampleModalLabel">
              Add New
            </h5>
            <h5 v-else="editMode" class="modal-title" id="exampleModalLabel">
              Update User's Info
            </h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <form @submit.prevent="editMode ? updateUser() : createUser()">
            <div class="modal-body">
              <div class="form-group">
                <input
                  v-model="form.name"
                  type="text"
                  name="name"
                  placeholder="name"
                  class="form-control"
                  :class="{ 'is-invalid': form.errors.has('name') }"
                />
                <has-error :form="form" field="name"></has-error>
              </div>
              <div class="form-group">
                <input
                  v-model="form.email"
                  type="text"
                  name="email"
                  placeholder="Email"
                  class="form-control"
                  :class="{ 'is-invalid': form.errors.has('email') }"
                />
                <has-error :form="form" field="email"></has-error>
              </div>
              <div class="form-group">
                <input
                  v-model="form.bio"
                  type="text"
                  name="bio"
                  placeholder="Short Bio form User(Optional)"
                  class="form-control"
                  :class="{ 'is-invalid': form.errors.has('bio') }"
                />
                <has-error :form="form" field="bio"></has-error>
              </div>

              <div class="form-group">
                <select
                  name="type"
                  v-model="form.type"
                  id="type"
                  class="form-control"
                  :class="{ 'is-invalid': form.errors.has('type') }"
                >
                  <option value="">Select User Role</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                  <option value="author">Author</option>
                </select>
                <has-error :form="form" field="type"></has-error>
              </div>

              <div class="form-group">
                <input
                  v-model="form.password"
                  type="password"
                  name="password"
                  placeholder="password"
                  class="form-control"
                  :class="{ 'is-invalid': form.errors.has('password') }"
                />
                <has-error :form="form" field="password"></has-error>
              </div>

              <div class="form-group">
                <input
                  v-model="form.photo"
                  type="photo"
                  name="photo"
                  placeholder="photo"
                  class="form-control"
                  :class="{ 'is-invalid': form.errors.has('photo') }"
                />
                <has-error :form="form" field="photo"></has-error>
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-warning"
                data-dismiss="modal"
              >
                Close
              </button>
              <button v-show="!editMode" type="submit" class="btn btn-success">
                Create
              </button>
              <button v-show="editMode" type="submit" class="btn btn-primary">
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      editMode: false,
      users: {},
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
  methods: {
      getResults(page =1){
        axios.get('api/user?page=' + page)
				.then(response => {
					this.users = response.data;
				});
      },
    //modal
    newModal() {
      this.editMode = false;
      this.form.reset();
      $("#exampleModal").modal("show");
    },

    //modal
    editModal(user) {
      this.editMode = true;
      this.form.reset();
      $("#exampleModal").modal("show");
      this.form.fill(user);
    },
    //load user
    loadUsers() {
       if(this.$gate.isAdminOrAuthor()){
      axios.get("api/user").then(({ data }) => (this.users = data));
       }
    },

    //create a new user
    createUser() {
      this.$Progress.start();
      this.form
        .post("api/user")
        .then(() => {
          Fire.$emit("AfterCreate", true);
          $("#exampleModal").modal("hide");

          Toast.fire({
            icon: "success",
            title: "User Created successfully",
          });
          this.$Progress.finish();
        })
        .catch(() => {});
    },

    //update user
    updateUser( ) {
      this.$Progress.start();
      this.form
        .put('api/user/' + this.form.id)
        .then(() => {
            Fire.$emit("AfterCreate", true);
          $("#exampleModal").modal("hide");

          Toast.fire({
            icon: "success",
            title: "User updated successfully",
          });
          this.$Progress.finish();
        })
        .catch(() => {
            this.$Progress.fail();
        });

    },
    //delete user
    deleteUser(id) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        //Send request to the serve
        if (result.isConfirmed) {
          this.form
            .delete("/api/user/" + id)
            .then(() => {
              Swal.fire("Deleted!", "Your file has been deleted.", "success");
              Fire.$emit("AfterCreate", true);
            })
            .catch(() => {
              Swal.fire("Failed!", "There was something wrong.", "warning");
            });
        }
      });
    },
  },
  created() {
      Fire.$on("searching", () => {
          let query = this.$parent.search
        axios.get('api/findUser?q=' + query)
        .then((data) => {
            this.users = data.data
        })
         .catch(() => {
             Toast.fire({
            icon: "error",
            title: "User not found",
          });
        })
      });
    this.loadUsers();
    Fire.$on("AfterCreate", () => {
      this.loadUsers();
    });
    //setInterval(() => this.loadUsers() ,3000)
  },
};
</script>
