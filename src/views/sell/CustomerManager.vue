<template>
  <div class="contain">
    <p>
      <router-link to="/sell/addcustomer">
        <el-button>
          <i class="el-icon-circle-plus"></i>添加
        </el-button>
      </router-link>
    </p>
    <el-table :data="tableData" stripe style="100%">
      <el-table-column prop="ordinal" label="序号" width="50px">
        <template slot-scope="scope">
          <span>{{scope.$index+1}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="customerCode" label="客户编号" width="100px">
        <template slot-scope="scope">
          <span>{{scope.row.customerCode}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="客户名称" width="100px">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="contactor" label="联系人" width="80px">
        <template slot-scope="scope">
          <span>{{scope.row.contactor}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="地址" width="180px">
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
          <el-button type="danger" class="btn" @click="deleteCustomer(scope.$index, scope.row)">删除</el-button>
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
    <el-dialog title="客户修改" :visible.sync="dialogFormVisible" width="750px">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
        <el-form-item label="客户编号" :label-width="formLabelWidth">
          <el-input v-model="ruleForm.customerCode" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="客户名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="ruleForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="客户密码" :label-width="formLabelWidth" prop="passWord">
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
        <el-button type="primary" @click="saveChange()">保存修改</el-button>
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
      dialogFormVisible: false,
      currPage: 1,
      result: "",
      ruleForm: {
        customerCode: "",
        name: "",
        passWord: "",
        contactor: "",
        address: "",
        postCode: "",
        createDate: new Date().toISOString().split("T")[0],
        tel: "",
        fax: ""
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
      formLabelWidth: "80px"
    };
  },
  created() {
    requestGet("/api/main/sell/customer/show").then(resp => {
      this.result = resp.data;
      this.tableData = resp.data.list;
      console.log(this.tableData);
    });
  },
  methods: {
    showDialog(index, row) {
      console.log("index", index, "row", row);
      this.ruleForm.customerCode = row.customerCode;
      this.ruleForm.name = row.name;
      this.ruleForm.passWord = row.passWord;
      this.ruleForm.contactor = row.contactor;
      this.ruleForm.address = row.address;
      this.ruleForm.postCode = row.postCode;
      this.ruleForm.tel = row.tel;
      this.ruleForm.fax = row.fax;
      this.dialogFormVisible = true;
    },
    saveChange() {
      this.dialogFormVisible = false;
      console.log(this.ruleForm);
      requestPost("/api/main/sell/customer/update", this.ruleForm).then(
        resp => {
          let result = resp.data;
          console.log("修改响应", result);
          location.reload();
        }
      );
    },
    deleteCustomer(index, row) {
      console.log(row.customerCode);
      this.$confirm("此操作将永久删除该账号, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          requestPost("/api/main/sell/customer/delete", {
            customerCode: row.customerCode
          }).then(resp => {
            let res = resp.data;
            console.log("修改响应", res);
            if (res.code === 2) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              requestGet("/api/main/sell/customer/show").then(resp => {
                this.result = resp.data;
                this.tableData = resp.data.list;
                console.log(this.tableData);
              });
              this.currPage=1;
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
    goPage(page) {
      this.currPage = page;
      requestGet("/api/main/sell/customer/show", {
        page: page
      }).then(resp => {
        this.result = resp.data;
        this.tableData = this.result.list;
      });
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