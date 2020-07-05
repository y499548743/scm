<template>
  <div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="采购单编号">
        <el-input v-model="formInline.poId"></el-input>
      </el-form-item>
      <el-form-item label="处理状态">
        <el-select v-model="formInline.status">
          <el-option label="新增" value="1"></el-option>
          <el-option label="已收货" value="2"></el-option>
          <el-option label="已付款" value="3"></el-option>
          <el-option label="已了结" value="4"></el-option>
          <el-option label="已预付" value="5"></el-option>
        </el-select>
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
        <el-button type="primary" @click="onSubmit">查询</el-button>
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
          <span @click="showMsg(scope.$index,scope.row)">{{scope.row.poId}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="160px">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="venderName" label="供应商名称" width="100px">
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
      <el-table-column prop="status" label="处理状态">
        <template slot-scope="scope">
          <span>{{scope.row.status|status}}</span>
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
    <el-dialog title="采购单详细信息" :visible.sync="dialogTableVisible">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="主信息" name="first">
          <el-table :data="pomainMsg">
            <el-table-column prop="poId" label="采购单编号"></el-table-column>
            <el-table-column prop="createTime" label="创建时间"></el-table-column>
            <el-table-column prop="venderName" label="供应商名称"></el-table-column>
            <el-table-column prop="account" label="创建用户"></el-table-column>
            <el-table-column prop="tipFee" label="附加费用"></el-table-column>
            <el-table-column prop="productTotal" label="采购产品总价"></el-table-column>
            <el-table-column prop="poTotal" label="采购单总价格"></el-table-column>
            <el-table-column prop="payType" label="付款方式"></el-table-column>
            <el-table-column prop="prePayFee" label="最低预付款金额"></el-table-column>
            <el-table-column prop="status" label="处理状态"></el-table-column>
            <el-table-column prop="remark" label="备注"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="入库信息" name="second">
          <el-table :data="pomainMsg">
            <el-table-column prop="stockTime" label="入库时间"></el-table-column>
            <el-table-column prop="stockUser" label="入库操作用户"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="预付信息" name="third">
          <el-table :data="pomainMsg">
            <el-table-column prop="prePayTime" label="预付时间"></el-table-column>
            <el-table-column prop="prePayUser" label="预付操作用户"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="付款信息" name="fourth">
          <el-table :data="pomainMsg">
            <el-table-column prop="payTime" label="付款时间"></el-table-column>
            <el-table-column prop="payUser" label="付款操作用户"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="明细信息" name="fifth">
          <el-table :data="detailMsg">
            <el-table-column prop="productCode" label="产品编号"></el-table-column>
            <el-table-column prop="productName" label="产品名称"></el-table-column>
            <el-table-column prop="unitName" label="产品数量单位"></el-table-column>
            <el-table-column prop="num" label="产品数量"></el-table-column>
            <el-table-column prop="unitPrice" label="采购单价"></el-table-column>
            <el-table-column prop="itemPrice" label="产品明细总价"></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>
<script>
import { requestGet } from "../../utils/http";
export default {
  data() {
    return {
      formInline: {
        poId: "",
        dateValue: "",
        status: "",
        vender: ""
      },
      currPage: 1,
      tableData: [],
      venderMsg: [],
      result: "",
      dialogFormVisible: false,
      dialogTableVisible: false,
      pomainMsg: [],
      detailMsg: [],
      activeName: "first",
      venderRadio: false
    };
  },
  created() {
    requestGet("/api/main/purchase/vender/all").then(resp => {
      this.venderMsg = resp.data;
      console.log(this.venderMsg, "111");
    });
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
    },
    status(value) {
      if (value == 1) {
        return "新增";
      }
      if (value == 2) {
        return "已收货";
      }
      if (value == 3) {
        return "已付款";
      }
      if (value == 4) {
        return "已了结";
      }
      if (value == 5) {
        return "已预付";
      }
    }
  },
  methods: {
     venderChecked(index, row) {
      sessionStorage.setItem("vender", JSON.stringify(row));
    },
    onSubmit() {
      let vender = JSON.parse(sessionStorage.getItem("vender"));
      if(vender==null){
        this.formInline["venderCode"] = '';
      }else{
        this.formInline["venderCode"] = vender.venderCode;
      }
      let startDate = this.formInline.dateValue[0];
      let endDate = this.formInline.dateValue[1];
      this.formInline["startDate"] = startDate;
      this.formInline["endDate"] = endDate;
      this.formInline["page"] = this.currPage;
      console.log(this.formInline);
      requestGet("/api/main/purchase/pomain/query", this.formInline).then(
        resp => {
          this.result = resp.data;
          this.tableData = resp.data.list;
          console.log(this.tableData);
        }
      );
    },
    venderConfirm() {
      let vender = JSON.parse(sessionStorage.getItem("vender"));
      this.formInline.vender = vender.name;
      this.dialogFormVisible = false;
    },
    showMsg(index, row) {
      console.log("index", index, "row", row);
      this.dialogTableVisible = true;
      this.pomainMsg.length = 0;
      this.pomainMsg.push(row);
      requestGet("/api/main/purchase/pomain/queryItem", {
        poId: row.poId
      }).then(resp => {
        this.detailMsg = resp.data;
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
    }
  }
};
</script>
<style scoped>
.vcipt {
  width: 217px;
}
</style>