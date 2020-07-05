<template>
  <div class="contain">
    <!-- <p>
      <router-link to="/purchase/addsupplier">
        <el-button>
          <i class="el-icon-circle-plus"></i>添加
        </el-button>
      </router-link>
    </p>-->
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="供应商编号">
        <el-input v-model="formInline.venderCode"></el-input>
      </el-form-item>
      <el-form-item label="供应商名称">
        <el-input v-model="formInline.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">过滤</el-button>
      </el-form-item>
      <el-form-item>
        <router-link to="/purchase/addsupplier">
          <el-button @click="onSubmit">
            <i class="el-icon-circle-plus"></i>添加
          </el-button>
        </router-link>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" stripe style="100%">
      <el-table-column prop="ordinal" label="序号" width="50px">
        <template slot-scope="scope">
          <span>{{scope.$index+1}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="venderCode" label="供应商编号" width="90px">
        <template slot-scope="scope">
          <span>{{scope.row.venderCode}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="供应商名称" width="90px">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="contactor" label="联系人" width="80px">
        <template slot-scope="scope">
          <span>{{scope.row.contactor}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="地址" width="160px">
        <template slot-scope="scope">
          <span>{{scope.row.address}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="postCode" label="邮政编码" width="80px">
        <template slot-scope="scope">
          <span>{{scope.row.postCode}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createDate" label="注册日期" width="160px">
        <template slot-scope="scope">
          <span>{{scope.row.createDate}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="tel" label="电话" width="120px">
        <template slot-scope="scope">
          <span>{{scope.row.tel}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="fax" label="传真">
        <template slot-scope="scope">
          <span>{{scope.row.fax}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="opp" label="操作" width="110px">
        <template slot-scope="scope">
          <el-button type="primary" class="btn" @click="showDialog(scope.$index, scope.row)">修改</el-button>
          <el-button type="danger" class="btn" @click="deleteUser(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      :total="this.result.total"
      layout="prev, pager, next"
      @current-change="goPage"
      :current-page="currPage"
    ></el-pagination>
    <el-dialog title="供应商修改" :visible.sync="dialogFormVisible" width="750px">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
        <el-form-item label="供应商编号" :label-width="formLabelWidth" prop="venderCode">
          <el-input v-model="ruleForm.venderCode" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="供应商名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="ruleForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="供应商密码" :label-width="formLabelWidth" prop="passWord">
          <el-input v-model="ruleForm.passWord" autocomplete="off" show-password></el-input>
        </el-form-item>
        <el-form-item label="联系人" :label-width="formLabelWidth" prop="contactor">
          <el-input v-model="ruleForm.contactor" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址" :label-width="formLabelWidth">
          <el-input v-model="ruleForm.address" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮政编码" :label-width="formLabelWidth">
          <el-input v-model="ruleForm.postCode" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="注册日期" :label-width="formLabelWidth">
          <el-input v-model="ruleForm.createDate" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth" prop="tel">
          <el-input v-model="ruleForm.tel" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="传真" :label-width="formLabelWidth">
          <el-input v-model="ruleForm.fax" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveChange('ruleForm')">保存修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { requestGet } from "../../utils/http";
import { requestPost } from "../../utils/http";
export default {
  data() {
    return {
      tableData: [],
      currPage: 1,
      dialogFormVisible: false,
      result: "",
      ruleForm: {
        venderCode: "",
        name: "",
        passWord: "",
        contactor: "",
        address: "",
        postCode: "",
        createDate: new Date().toISOString().split("T")[0],
        tel: "",
        fax: ""
      },
      formInline: {
        name: "",
        venderCode: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { min: 1, max: 100, message: "长度不超过100", trigger: "blur" }
        ],
        passWord: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 4, max: 20, message: "要求4~20位字符", trigger: "blur" }
        ],
        contactor: [
          { required: true, message: "联系人不能为空", trigger: "blur" }
        ],
        tel: [{ required: true, message: "电话不能为空", trigger: "blur" }]
      },
      formLabelWidth: "100px"
    };
  },
  created() {
    requestGet("/api/main/purchase/vender/show").then(resp => {
      this.result = resp.data;
      console.log(this.result);
      this.tableData = this.result.list;
      console.log(this.tableData, 1111);
    });
  },
  methods: {
    goPage(page) {
      this.currPage = page;
      this.formInline["page"] = this.currPage;
      requestGet("/api/main/purchase/vender/show", this.formInline).then(
        resp => {
          this.result = resp.data;
          this.tableData = this.result.list;
        }
      );
    },
    showDialog(index, row) {
      console.log("index", index, "row", row);
      this.ruleForm.venderCode = row.venderCode;
      this.ruleForm.name = row.name;
      this.ruleForm.passWord = row.passWord;
      this.ruleForm.contactor = row.contactor;
      this.ruleForm.address = row.address;
      this.ruleForm.postCode = row.postCode;
      this.ruleForm.tel = row.tel;
      this.ruleForm.fax = row.fax;
      this.dialogFormVisible = true;
    },
    saveChange(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          requestPost("/api/main/purchase/vender/update", this.ruleForm).then(
            resp => {
              let res = resp.data;
              console.log("修改响应", res);
              if (res.code == 2) {
                requestGet("/api/main/purchase/vender/show").then(resp => {
                  this.result = resp.data;
                  this.tableData = this.result.list;
                });
              }
            }
          );
          this.currPage = 1;
          this.dialogFormVisible = false;
        }else{
          console.log("error submit!!");
          return false;
        }
      });
    },
    deleteUser(index, row) {
      console.log(row.venderCode);
      this.$confirm("此操作将永久删除该账号, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          requestPost("/api/main/purchase/vender/delete", {
            venderCode: row.venderCode
          }).then(resp => {
            let res = resp.data;
            console.log("修改响应", res);
            if (res.code === 2) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              requestGet("/api/main/purchase/vender/show").then(resp => {
                this.result = resp.data;
                this.tableData = this.result.list;
              });
              this.currPage = 1;
            } else {
              this.$message({
                type: "info",
                message: res.message
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    onSubmit() {
      requestGet("/api/main/purchase/vender/show", this.formInline).then(
        resp => {
          this.result = resp.data;
          this.tableData = this.result.list;
        }
      );
    }
  }
};
</script>

<style scoped>
/* .contain {
  width: 1000px;
  margin: auto;
} */
p {
  padding: 10px 0 10px 0;
}
.btn {
  padding: 2px 3px;
}
</style>