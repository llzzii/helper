<template>
  <div id="wrapper">
    <!-- <img id="logo" :src="logo" alt="浪潮云" /> -->
    <main>
      <el-alert
        title="此处配置保存到本地计算机上，如果更换计算机，需要重新配置！"
        type="warning"
        description=""
        :closable="false"
        :show-icon="true"
      >
      </el-alert>
      <el-form
        :model="ruleForm"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <label class="form-title">本地SSH客户端配置</label>
        <el-form-item label="SSH客户端:" class="file-container">
          Xshell
        </el-form-item>
        <el-form-item label="程序路径" class="file-container">
          <el-input
            class="upload-input"
            v-model="ruleForm.xshellClientPath"
            :disabled="true"
            placeholder="请选择程序路径"
          ></el-input>
          <el-upload
            class="upload-demo"
            action=""
            name="xshellClientPath"
            :http-request="uploadFile"
            :show-file-list="false"
          >
            <el-button size="small" type="primary">点击选择</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="SSH客户端:" class="file-container">
          PuTTY
        </el-form-item>
        <el-form-item label="程序路径" class="file-container">
          <el-input
            class="upload-input"
            v-model="ruleForm.puTTYClientPath"
            :disabled="true"
            placeholder="请选择程序路径"
          ></el-input>
          <el-upload
            class="upload-demo"
            action=""
            name="puTTYClientPath"
            :http-request="uploadFile"
            :show-file-list="false"
          >
            <el-button size="small" type="primary">点击选择</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="SSH客户端:" class="file-container">
          SecureCRT
        </el-form-item>
        <el-form-item label="程序路径" class="file-container">
          <el-input
            class="upload-input"
            v-model="ruleForm.secureCRTClientPath"
            :disabled="true"
            placeholder="请选择程序路径"
          ></el-input>
          <el-upload
            class="upload-demo"
            action=""
            name="secureCRTClientPath"
            :http-request="uploadFile"
            :show-file-list="false"
          >
            <el-button size="small" type="primary">点击选择</el-button>
          </el-upload>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >提交</el-button
          >
          <el-button @click="resetForm('ruleForm')">重置</el-button>
          <!-- <el-button @click="update()">修改</el-button>
          <el-button @click="openTools()">打开工具</el-button> -->
        </el-form-item>
      </el-form>
    </main>
  </div>
</template>

<script>
import { message, openTool } from "@/api/setting";
export default {
  name: "config-page",
  data: () => ({
    logo: require("@/assets/logo.png"),
    listData: [],
    initData: null,
    ruleForm: {
      secureCRTClientPath: "",
      xshellClientPath: "",
      puTTYClientPath: "",
    },
  }),
  created() {
    this.getdata();
  },
  methods: {
    submitForm(formName) {
      if (
        this.ruleForm.secureCRTClientPath == "" &&
        this.ruleForm.puTTYClientPath == "" &&
        this.ruleForm.xshellClientPath == ""
      ) {
        this.$message({
          message: "请选择文件路径",
          type: "warning",
        });
        return;
      }
      this.$store.set("setting", this.ruleForm);
      this.$message({
        message: "配置完成",
        type: "success",
      });
    },
    update() {
      this.$alert(this.$store.get("setting"), "提示", {
        confirmButtonText: "确定",
      });
      //   updateSetting(this.ruleForm).then((res) => {
      //     console.log(res);
      //   });
    },
    resetForm(formName) {
      this.ruleForm = {
        secureCRTClientPath: "",
        xshellClientPath: "",
        puTTYClientPath: "",
      };
      //   this.$refs[formName].resetFields();
    },
    uploadFile(e) {
      let path = e["file"].path || "";
      let name = e["file"].name || "";
      if (!name.endsWith(".exe")) {
        this.$message({
          message: "请选择以exe结尾的可执行程序",
          type: "warning",
        });

        return;
      }
      //   this.ruleForm[e["filename"]] = path;
      this.$set(this.ruleForm, [e["filename"]], path);
    },

    getMessage() {
      message().then((res) => {
        this.$alert(res.data, "提示", {
          confirmButtonText: "确定",
        });
      });
    },
    openTools() {
      let data = {
        toolType: "xshell",
        user: "root",
        host: "117.73.11.200",
        port: "22",
        pwd: "Lc13yfwpW",
      };
      openTool(data).then((res) => {
        console.log(res);
      });
    },

    getdata() {
      console.log(this.$store.get("setting"));
      this.ruleForm = this.$store.get("setting") || this.ruleForm;
    },
  },
};
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: "Source Sans Pro", sans-serif;
}
.box-card {
  margin-bottom: 10px;
}
#wrapper {
  padding: 10px 30px;
}

#logo {
  height: auto;
  margin-bottom: 20px;
  width: 120px;
}
.file-bottom {
  position: absolute;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
  opacity: 0;
  width: 100%;
}
.file-container {
  position: relative;
}
main {
  /* display: flex;
  justify-content: space-between; */
}

main > div {
  flex-basis: 50%;
}

.left-side {
  display: flex;
  flex-direction: column;
}

.welcome {
  color: #555;
  font-size: 23px;
  margin-bottom: 10px;
}

.title {
  color: #2c3e50;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 6px;
}

.title.alt {
  font-size: 18px;
  margin-bottom: 10px;
}
.doc {
  margin-bottom: 20px;
}
.doc p {
  color: black;
  margin-bottom: 10px;
}
.conten {
  text-align: center;
}
.form-title {
  font-weight: 600;
  margin: 10px 0;
  display: block;
}
.upload-input.el-input {
  width: calc(100% - 200px);
}
.upload-demo {
  display: inline-block;
}
</style>
