<template>
  <div class="contain">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="采购单编号">
        <el-input v-model="formInline.poId"></el-input>
      </el-form-item>
      <el-form-item label="日期范围">
        <el-date-picker
          v-model="formInline.dateValue"
          type="daterange"
          range-separator="至"
          start-placeholder="起始日期"
          end-placeholder="截止日期"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="供应商选择">
        <el-input v-model="formInline.vender" @focus="dialogFormVisible=true"></el-input>
      </el-form-item>
      <el-form-item label="付款方式">
        <el-select v-model="formInline.payType">
          <el-option label="货到付款" value="1"></el-option>
          <el-option label="款到发货" value="2"></el-option>
          <el-option label="预付款到发货" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">过滤</el-button>
      </el-form-item>
      <el-form-item>
        <router-link to="/purchase/addpomain">
          <el-button>
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
      <el-table-column prop="poId" label="采购单编号" width="140px">
        <template slot-scope="scope">
          <span @click="showPoitems(scope.$index, scope.row)">{{scope.row.poId}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="venderName" label="供应商名称" width="90px">
        <template slot-scope="scope">
          <span>{{scope.row.venderName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="account " label="创建用户" width="80px">
        <template slot-scope="scope">
          <span>{{scope.row.account}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="tipFee" label="附加费用" width="80px">
        <template slot-scope="scope">
          <span>{{scope.row.tipFee}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="productTotal" label="采购产品总价" width="70px">
        <template slot-scope="scope">
          <span>{{scope.row.productTotal}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="poTotal" label="采购单总价格" width="70px">
        <template slot-scope="scope">
          <span>{{scope.row.poTotal}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="payType" label="付款方式" width="80px">
        <template slot-scope="scope">
          <span>{{scope.row.payType|paytype}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="prePayFee" label="最低预付款金额" width="80px">
        <template slot-scope="scope">
          <span>{{scope.row.prePayFee}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="opp" label="操作" >
        <template slot-scope="scope">
          <router-link to="/purchase/changepomain">
            <el-button type="primary" class="btn" @click="getpoId(scope.$index,scope.row)">修改</el-button>
          </router-link>
          <el-button type="danger" class="btn" @click="deletePomain(scope.$index, scope.row)">删除</el-button>
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
    <el-dialog title="供应商选择" :visible.sync="dialogFormVisible">
      <el-table :data="venderMsg">
        <el-table-column label="选择">
          <template slot-scope="scope">
            <span>
              <el-radio
                v-model="venderRadio"
                :label="scope.$index"
                @change="venderChecked(scope.$index, scope.row)"
              >ㅤㅤㅤ</el-radio>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="vendertCode" label="供应商编码">
          <template slot-scope="scope">
            <span>{{scope.row.venderCode}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="供应商名称">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="venderConfirm">确 认</el-button>
      </div>
    </el-dialog>
    <el-dialog title="采购单明细信息" :visible.sync="dialogTableVisible">
      <el-table :data="gridData">
        <el-table-column prop="productCode" label="产品编号"></el-table-column>
        <el-table-column prop="productName" label="产品名称"></el-table-column>
        <el-table-column prop="unitName" label="产品数量单位"></el-table-column>
        <el-table-column prop="num" label="产品数量"></el-table-column>
        <el-table-column prop="unitPrice" label="采购单价"></el-table-column>
        <el-table-column prop="itemPrice" label="产品明细总价"></el-table-column>
      </el-table>
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
      result: "",
      formInline: {
        poId: "",
        dateValue: "",
        vender: ""
      },
      venderMsg: [],
      dialogFormVisible: false,
      dialogTableVisible: false,
      gridData: [],
      venderRadio: false
    };
  },
  created() {
    requestGet("/api/main/purchase/pomain/show", { type: 1 }).then(resp => {
      this.result = resp.data;
      this.tableData = resp.data.list;
      console.log(this.result);
      console.log(this.tableData, "1111");
    });
    requestGet("/api/main/purchase/vender/all").then(resp => {
      this.venderMsg = resp.data;
      console.log(this.venderMsg, "111");
    });
  },
  methods: {
    getpoId(index, row) {
      console.log("index", index, "row", row);
      sessionStorage.setItem("poId", row.poId);
      sessionStorage.setItem("poIndex", index);
    },
    deletePomain(index, row) {
      console.log(row.poId);
      this.$confirm("此操作将永久删除该采购单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          requestPost("/api/main/purchase/pomain/delete", {
            poId: row.poId
          }).then(resp => {
            let res = resp.data;
            console.log("修改响应", res);
            if (res.code === 2) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              requestGet("/api/main/purchase/pomain/show", { type: 1 }).then(
                resp => {
                  this.result = resp.data;
                  this.tableData = resp.data.list;
                }
              );
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
    goPage(page) {
      this.currPage = page;
      this.formInline["page"] = this.currPage;
      requestGet("/api/main/purchase/pomain/query", this.formInline).then(
        resp => {
          this.result = resp.data;
          this.tableData = this.result.list;
        }
      );
    },
    onSubmit() {
      let vender = JSON.parse(sessionStorage.getItem("vender"));
      let startDate = this.formInline.dateValue[0];
      let endDate = this.formInline.dateValue[1];
      this.formInline["startDate"] = startDate;
      this.formInline["endDate"] = endDate;
      this.formInline["venderCode"] = vender.venderCode;
      console.log(this.formInline);
      requestGet("/api/main/purchase/pomain/query", this.formInline).then(
        resp => {
          this.result = resp.data;
          this.tableData = resp.data.list;
          console.log(this.tableData);
        }
      );
    },
    venderChecked(index, row) {
      sessionStorage.setItem("vender", JSON.stringify(row));
    },
    venderConfirm() {
      let vender = JSON.parse(sessionStorage.getItem("vender"));
      this.formInline.vender = vender.name;
      this.dialogFormVisible = false;
    },
    showPoitems(index, row) {
      console.log("index", index, "row", row);
      requestGet("/api/main/purchase/pomain/queryItem", {
        poId: row.poId
      }).then(resp => {
        this.gridData = resp.data;
        console.log(this.gridData);
      });
      this.dialogTableVisible = true;
    }
  },
  filters: {
    paytype(value) {
      if (value == 1) {
        return "货到付款";
      }
      if (value == 2) {
        return "款到发货";
      }
      if (value == 3) {
        return "预付款到发货";
      }
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
.vcipt {
  width: 217px;
}
</style>