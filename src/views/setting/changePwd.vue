<template>
  <div class="components-container">
    <el-dialog v-el-drag-dialog :visible.sync="dialogTableVisible" title="修改密码" :close-on-click-modal="false">
      <el-form :model="pwdForm" :rules="rules" ref="pwdForm" label-position="left" label-width="120px">
        <el-form-item label="旧密码" prop="password_old">
          <el-input type="password" class="m-input-pwd" v-model="pwdForm.password_old"
                    placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password_new">
          <el-input type="password" class="m-input-pwd" v-model="pwdForm.password_new"
                    placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="password_repeat" required>
          <el-input type="password" class="m-input-pwd" v-model="pwdForm.password_repeat"
                    placeholder=""></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="doConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import elDragDialog from 'src/directive/el-dragDialog'

  export default {
    name: 'DragDialogDemo',
    directives: {elDragDialog},
    data() {
      const consistentPwd = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请再次确认新密码!'))
        } else if (value != this.pwdForm.password_new) {
          callback(new Error('请确认两次密码输入一致!'))
        } else {
          callback();
        }
      }

      return {
        dialogTableVisible: false,
        pwdForm: {
          password_old: '',
          password_new: '',
          password_repeat: ''
        },
        rules: {
          password_old: [
            {required: true, message: '请输入旧密码', trigger: 'blur'}
          ],
          password_new: [
            {required: true, message: '请输入新密码', trigger: 'blur'}
          ],
          password_repeat: [
            {validator: consistentPwd, trigger: 'blur'},
          ],
        }
      }
    },
    methods: {
      //  给外部调用的显示
      showDialog() {
        this.dialogTableVisible = true;
      },

      doConfirm() {
        this.$refs.pwdForm.validate(
          valid => {
            if (valid) {
              this.$confirm('修改成功需要重新登录', '提示').then(
                () => {
                  if (this.$store.getters.roles[0] == 'supplizer') {
                    this.$http.post(this.$api.update_supplizer_password, {
                      "supassword": this.password_new,
                      "oldpassword": this.password_old,
                    }).then(
                      res => {
                        if (res.data.status == 200) {
                          let resData = res.data,
                              data = res.data.data;

                          this.$store.dispatch('LogOut').then(
                            () => {
                              this.push('/login');
                              this.$notify({
                                title: '密码已重置',
                                message: `请重新登录`,
                                type: 'info'
                              });
                            }
                          );
                        }
                      }
                    )
                  } else {
                    this.$http.post(this.$api.update_admin_password, this.pwdForm).then(
                      res => {
                        if (res.data.status == 200) {
                          let resData = res.data,
                              data = res.data.data;

                          this.$store.dispatch('LogOut').then(
                            () => {
                              this.push('/login');
                              this.$notify({
                                title: '密码已重置',
                                message: `请重新登录`,
                                type: 'info'
                              });
                            }
                          );
                        }
                      }
                    )
                  }
                }
              )
            } else {
              this.$message.warning('请根据校验信息完善表单!');
            }
          }
        );

      },
    },
    created() {
      // console.log(this.$confirm);
    },
  }
</script>
