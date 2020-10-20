<template>
    <div class="login-container">
        <div class="login-box">
           <div class="avatar-box">
               <img src="../assets/logo.png" alt="">
           </div>
           <el-form :model="loginForm" label-width="0px" class="login-form" :rules="loginRules" ref="loginFormRef" >
                 <!-- 用户名 -->
                 <el-form-item class="login-item"  prop="username">
                   <el-input v-model="loginForm.username" prefix-icon="el-icon-user-solid" placeholder="用户名">
                   </el-input>
                 </el-form-item>
                 <!-- 密码 -->
                 <el-form-item class="login-item" prop="password">
                   <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password" placeholder="密码">
                   </el-input>
                 </el-form-item>
                 <!-- 按钮 -->
                 <el-form-item class="btns-box">
                    <el-button type="primary" @click="submitForm('loginFormRef')" >登录</el-button>
                    <el-button type="info" @click="restLoginForm('loginFormRef')">重置</el-button>
                 </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            loginForm:{
                username:'',
                password:''
            },
            loginRules:{
                username:[
                    { required: true, message: '请输入登录名称', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }    
                ],
                password:[
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '密码错误', trigger: 'blur' }
                ]
            }
        }
    },
    methods:{
        submitForm(formName){
            this.$refs[formName].validate(async (valid)=>{
                if(!valid) return false
                const { data } = await this.$axios.post('login', this.loginForm)
                if(data.meta.status === 400){
                    this.$message('登录名或密码错误')
                    return false
                }
                this.$message('登录成功')
                window.sessionStorage.setItem('token', data.data.token)
                this.$router.push('/home')
            })
        },
        restLoginForm(formName){
            this.$refs[formName].resetFields()
        }
    }

}
</script>

<style lang="less" scoped>
    .login-container{
        position: relative;
        height: 100%;
        background-color: #2b4b6b;
        .login-box{
            width: 450px;
            height: 300px;
            background-color: #fff;
            border-radius: 3px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            .avatar-box{
                height: 130px;
                width: 130px;
                border: 1px solid #eee;
                padding: 10px;
                border-radius: 50%;
                position: absolute;
                top: 0;
                left: 50%;
                transform: translate(-50%,-50%);
                background-color: #fff;
                z-index: 999;
                img{
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background-color: #eee;
                }

            }
        }
        .login-form{
            padding: 80px 20px 0;
            .login-item{
                margin-top: 20px;
            }
        }
        .btns-box{
            display: flex;
            justify-content: flex-end;
        }
    }
</style>
