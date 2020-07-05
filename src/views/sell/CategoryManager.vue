<template>
  <div class="contain">
    <p>
      <router-link to="/sell/addcategory">
        <el-button>
          <i class="el-icon-circle-plus"></i>添加
        </el-button>
      </router-link>
    </p>
    <el-table :data="tableData" stripe style="100%">
      <el-table-column prop="ordinal" label="序号">
        <template slot-scope="scope">
          <span>{{scope.$index+1}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="categoryId" label="分类序列号">
        <template slot-scope="scope">
          <span>{{scope.row.categoryId}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="分类名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="描述">
        <template slot-scope="scope">
          <span>{{scope.row.remark}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="opp" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" class="btn" @click="showDialog(scope.$index, scope.row)">修改</el-button>
          <el-button type="danger" class="btn" @click="deleteProduct(scope.$index, scope.row)">删除</el-button>
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
    <el-dialog title="产品分类修改" :visible.sync="dialogFormVisible" width="750px">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
        <el-form-item label="分类序列号" :label-width="formLabelWidth">
          <el-input v-model="ruleForm.categoryId" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="分类名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="ruleForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input v-model="ruleForm.remark" autocomplete="off"></el-input>
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
      dialogFormVisible: false,
      currPage: 1,
      result: "",
      ruleForm: {
        categoryId: "",
        name: "",
        remark: ""
      },
      rules: {
        name: [{ required: true, message: "不能为空", trigger: "blur" }]
      },
      formLabelWidth: "80px"
    };
  },
  created() {
    requestGet("/api/main/sell/category/show").then(resp => {
      this.result = resp.data;
      this.tableData = resp.data.list;
      console.log(this.tableData);
    });
  },
  methods: {
    showDialog(index, row) {
      console.log("index", index, "row", row);
      this.ruleForm.categoryId = row.categoryId;
      this.ruleForm.name = row.name;
      this.ruleForm.remark = row.remark;
      this.dialogFormVisible = true;
    },
    // saveChange(formName) {
    //   this.dialogFormVisible = false;
    //   console.log(this.ruleForm);
    //   requestPost("/api/main/sell/category/update", this.ruleForm).then(
    //     resp => {
    //       let res = resp.data;
    //       console.log("修改响应", res);
    //       location.reload();
    //     }
    //   );
    // },
     saveChange(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          requestPost("/api/main/sell/category/update", this.ruleForm).then(
            resp => {
              let res = resp.data;
              console.log("修改响应", res);
              if (res.code == 2) {
                requestGet("/api/main/sell/category/show").then(resp => {
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
    deleteProduct(index, row) {
      console.log(row.venderCode);
      this.$confirm("此操作将永久删除该产品分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          requestPost("/api/main/sell/category/delete", {
            categoryId: row.categoryId
          }).then(resp => {
            let res = resp.data;
            console.log("修改响应", res);
            if (res.code === 2) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              requestGet("/api/main/sell/category/show").then(resp => {
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
      requestGet("/api/main/sell/category/show", {
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