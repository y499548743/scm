<template>
  <div class="contain">
    <p>
      <router-link to="/user/add">
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
      <el-table-column prop="account" label="用户账号" width="100px">
        <template slot-scope="scope">
          <span>{{scope.row.account}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="用户姓名" width="100px">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="锁定状态" width="80px">
        <template slot-scope="scope">
          <span>{{scope.row.status|status}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createDate" label="添加日期" width="160px">
        <template slot-scope="scope">
          <span>{{scope.row.createDate}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="models" label="用户权限列表">
        <template slot-scope="scope">
          <span v-for="item in scope.row.models" :key="item.modelCode">{{item.modelName}}ㅤ</span>
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
    <el-dialog title="用户修改" :visible.sync="dialogFormVisible" width="750px">
      <el-form :model="form">
        <el-form-item label="用户姓名" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" :label-width="formLabelWidth">
          <el-input v-model="form.passWord" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="锁定状态">
          <el-radio-group v-model="form.status">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="权限">
          <el-checkbox-group v-model="form.modelcodes">
            <el-checkbox label="1" name="modelcodes">采购管理</el-checkbox>
            <el-checkbox label="2" name="modelcodes">销售管理</el-checkbox>
            <el-checkbox label="3" name="modelcodes">系统管理</el-checkbox>
            <el-checkbox label="4" name="modelcodes">财务管理</el-checkbox>
            <el-checkbox label="5" name="modelcodes">仓库管理</el-checkbox>
            <el-checkbox label="6" name="modelcodes">业务报表</el-checkbox>
          </el-checkbox-group>
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
      result: {},
      tableData: [],
      currPage: 1,
      dialogFormVisible: false,
      form: {
        name: "",
        passWord: "",
        status: 0,
        modelcodes: []
      },
      formLabelWidth: "70px"
    };
  },
  created() {
    requestGet("/api/main/system/user/show").then(resp => {
      this.result = resp.data;
      this.tableData = this.result.list;
      console.log("result", this.result);
      console.log(this.tableData);
    });
  },
  filters: {
    status(value) {
      if (value === 0) {
        return "不锁定";
      } else if (value === 1) {
        return "锁定";
      }
    }
  },
  methods: {
    showDialog(index, row) {
      console.log("index", index, "row", row);
      let arr = [];
      for (let item of row.models) {
        console.log(item,111)
        console.log(item.modelcode,222)
        arr.push(item.modelCode.toString());
      }
      console.log("arr", arr);
      this.form.name = row.name;
      this.form.passWord = row.passWord;
      this.form.status = row.status.toString();
      this.form.modelcodes = [...arr];
      this.dialogFormVisible = true;
      sessionStorage.setItem("oldMsg", JSON.stringify(row));
      this.currPage=1;
    },
    saveChange() {
      let oldMsg = JSON.parse(sessionStorage.getItem("oldMsg"));
      console.log("oldMsg", oldMsg);
      this.form["account"] = oldMsg.account;
      this.dialogFormVisible = false;
      console.log(this.form);
      requestPost("/api/main/system/user/update", this.form).then(resp => {
        let result = resp.data;
        console.log("修改响应", result);
        requestGet("/api/main/system/user/show").then(resp => {
          this.result = resp.data;
          this.tableData = this.result.list;
        });
      });
    },
    deleteUser(index, row) {
      console.log(row.account);
      this.$confirm("此操作将永久删除该账号, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          requestPost("/api/main/system/user/delete ", {
            account: row.account
          }).then(resp => {
            let result = resp.data;
            console.log("修改响应", result);
            if (result.code === 2) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              requestGet("/api/main/system/user/show").then(resp => {
                this.result = resp.data;
                this.tableData = this.result.list;
              });
              this.currPage=1;
            } else {
              this.$message({
                type: "info",
                message: result.message
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
      requestGet("/api/main/system/user/show", {
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