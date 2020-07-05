<template>
  <div>
    <p>
      <el-button @click="addSoitems">
        <i class="el-icon-circle-plus"></i>增加明细
      </el-button>
      <el-button @click="saveSomain">
        <i class="el-icon-s-order"></i>保存
      </el-button>
    </p>
    <table class="somainTab">
      <tr>
        <td>销售单编号</td>
        <td>
          <el-input v-model="somainTab.soId" :disabled="true"></el-input>
        </td>
        <td>创建时间</td>
        <td>
          <el-input v-model="somainTab.createTime" :disabled="true"></el-input>
        </td>
        <td>客户</td>
        <td>
          <el-input v-model="somainTab.customer" class="customerIpt"></el-input>
          <span class="el-icon-edit-outline" @click="dialogFormVisible=true"></span>
        </td>
      </tr>
      <tr>
        <td>创建用户</td>
        <td>
          <el-input v-model="account" :disabled="true"></el-input>
        </td>
        <td>附加费用</td>
        <td>
          <el-input v-model="somainTab.tipFee" @input="getsoTotal"></el-input>
        </td>
        <td>销售单总价</td>
        <td>
          <el-input v-model="somainTab.soTotal" :disabled="diasble"></el-input>
        </td>
      </tr>
      <tr>
        <td>付款方式</td>
        <td>
          <el-select v-model="somainTab.payType" placeholder="请选择付款方式" @change="paySelect">
            <el-option value="1" label="货到付款"></el-option>
            <el-option value="2" label="款到发货"></el-option>
            <el-option value="3" label="预付款到发货"></el-option>
          </el-select>
        </td>
        <td>最低预付款金额</td>
        <td>
          <el-input v-model="somainTab.prePayFee"  :disabled="disabled"></el-input>
        </td>
        <td>备注</td>
        <td>
          <el-input></el-input>
        </td>
      </tr>
    </table>
    <el-table :data="tableData" style="width: 1100px">
      <el-table-column prop="ordinal" label="序号" width="50px">
        <template slot-scope="scope">
          <span>{{scope.$index+1}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="productCode" label="产品编号" width="160px">
        <template slot-scope="scope">
          <span>
            <el-input v-model="scope.row.productCode" :disabled="true"></el-input>
          </span>
          <span class="el-icon-edit-outline" @click="showProductDialog(scope.$index,scope.row)"></span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="产品名称">
        <template slot-scope="scope">
          <span>
            <el-input v-model="scope.row.name" :disabled="true"></el-input>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="unitName" label="数量单位">
        <template slot-scope="scope">
          <span>
            <el-input v-model="scope.row.unitName" :disabled="true"></el-input>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="num" label="产品数量">
        <template slot-scope="scope">
          <span>
            <el-input v-model.number="scope.row.num" @input="getItemPrice(scope.$index,scope.row)"></el-input>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="unitPrice" label="产品单价">
        <template slot-scope="scope">
          <span>
            <el-input v-model.number="scope.row.unitPrice" :disabled="true"></el-input>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="itemPrice" label="明细总价">
        <template slot-scope="scope">
          <span>
            <el-input v-model="scope.row.itemPrice"></el-input>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="opp" label="操作" width="120px">
        <template slot-scope="scope">
          <el-button type="danger" class="btn" @click="deleteSoitem(scope.$index,tableData)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="客户选择" :visible.sync="dialogFormVisible">
      <el-table :data="customerData">
        <el-table-column label="选择">
          <template slot-scope="scope">
            <span>
              <el-radio
                v-model="customerRadio"
                :label="scope.$index"
                @change="customerChecked(scope.$index, scope.row)"
              >ㅤㅤㅤ</el-radio>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="customertCode" label="客户编码">
          <template slot-scope="scope">
            <span>{{scope.row.customerCode}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="客户名称">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="customerConfirm">确 认</el-button>
      </div>
    </el-dialog>
    <el-dialog title="产品选择" :visible.sync="dialogProductVisible">
      <el-table :data="gridData">
        <el-table-column label="选择" width="150">
          <template slot-scope="scope">
            <span>
              <el-radio
                v-model="radio"
                :label="scope.$index"
                @change="productChecked(scope.$index, scope.row)"
              >ㅤㅤㅤ</el-radio>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="productCode" label="产品编码" width="150">
          <template slot-scope="scope">
            <span>{{scope.row.productCode}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="产品名称" width="200">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="unitName" label="数量单位">
          <template slot-scope="scope">
            <span>{{scope.row.unitName}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="noChange">取 消</el-button>
        <el-button type="primary" @click="productConfirm">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { requestGet } from "../../utils/http";
import { requestPost } from "../../utils/http";
import { requestPostJson } from "../../utils/http";
export default {
  data() {
    return {
      somainTab: {
        soId: parseInt(
          new Date(+new Date() + 8 * 3600 * 1000)
            .toISOString()
            .split(/-|T|:|Z/)
            .join("")
        ),
        createTime: new Date(+new Date() + 8 * 3600 * 1000)
          .toISOString()
          .replace("T", " ")
          .substr(0, 19),
        customer: "",
        tipFee: 0,
        productTotal: "",
        prePayFee: 0,
        payType: "",
        status: 1,
        soTotal: ""
      },
      dialogFormVisible: false,
      dialogProductVisible: false,
      result: "",
      tableData: [],
      gridData: [],
      radio: false,
      customerRadio: false,
      customerData: [],
      disabled:true
    };
  },
  created() {
    requestGet("/api/main/sell/customer/show").then(resp => {
      this.customerData = resp.data.list;
      console.log(this.customerData, "111");
    }),
      requestGet("/api/main/sell/product/all").then(resp => {
        this.gridData = resp.data;
        console.log(this.gridData, "222");
      });
  },
  computed: {
    ...mapState(["user"]),

    account: {
      get() {
        return this.$store.state.user.account;
      },
      set(value) {
        this.$store.commit("updateAccount", value);
      }
    }
  },
  mutations: {
    updateAccount(state, account) {
      state.user.account = account;
    }
  },
  methods: {
    customerChecked(index, row) {
      sessionStorage.setItem("customerMsg", JSON.stringify(row));
    },
    customerConfirm() {
      let customerMsg = JSON.parse(sessionStorage.getItem("customerMsg"));
      console.log(customerMsg, 111);
      this.somainTab.customer = customerMsg.name;
      this.dialogFormVisible = false;
    },
    showProductDialog(index, row) {
      this.dialogProductVisible = true;
      console.log("index", index, "row", row);
      this.tableData[index].productCode = "";
      this.tableData[index].name = "";
      this.tableData[index].unitName = "";
      sessionStorage.setItem("i", index);
    },
    productChecked(index, row) {
      console.log("index", index, "row", row);
      sessionStorage.setItem("productMsg", JSON.stringify(row));
    },
    productConfirm() {
      let productMsg = JSON.parse(sessionStorage.getItem("productMsg"));
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].productCode == "") {
          this.tableData[i].productCode = productMsg.productCode;
          this.tableData[i].name = productMsg.name;
          this.tableData[i].unitName = productMsg.unitName;
          this.tableData[i].unitPrice = productMsg.price;
          break;
        }
        if (this.tableData[i].productCode == productMsg.productCode) {
          this.$alert("不可重复添加同一产品", "警告", {
            type: "warning",
            center: true
          });
          break;
        }
      }
      this.dialogProductVisible = false;
    },
    noChange() {
      this.dialogProductVisible = false;
      let productMsg = JSON.parse(sessionStorage.getItem("productMsg"));
      let i = sessionStorage.getItem("i");
      this.tableData[i].productCode = productMsg.productCode;
      this.tableData[i].name = productMsg.name;
      this.tableData[i].unitName = productMsg.unitName;
    },
    addSoitems() {
      this.tableData.push({
        productCode: "",
        name: "",
        unitName: "",
        num: "",
        unitPrice: ""
      });
    },
    deleteSoitem(index, rows) {
      rows.splice(index, 1);
      this.somainTab.tipFee = parseFloat(this.somainTab.tipFee);
      let sum = 0;
      for (let i = 0; i < this.tableData.length; i++) {
        sum += this.tableData[i].itemPrice;
      }
      this.somainTab.soTotal = this.somainTab.tipFee + sum;
    },
    getItemPrice(index, row) {
      console.log("index", index, "row", row);
      console.log(this.tableData, "333");
      if (row.num > 0 && row.unitPrice > 0) {
        row.itemPrice = row.num * row.unitPrice;
        this.somainTab.productTotal = 0;
        for (let i = 0; i < this.tableData.length; i++) {
          this.somainTab.productTotal += this.tableData[i].itemPrice;
        }
      } else {
        row.itemPrice = "";
      }
      this.somainTab.soTotal =
        this.somainTab.tipFee + this.somainTab.productTotal;
    },
    saveSomain() {
      let customerMsg = JSON.parse(sessionStorage.getItem("customerMsg"));
      this.somainTab["account"] = this.account;
      this.somainTab["soitems"] = this.tableData;
      this.somainTab["customerCode"] = customerMsg.customerCode;
      // this.somainTab.soTotal =
      //   this.somainTab.tipFee + this.somainTab.productTotal;
      // this.somainTab.payType=Number(this.somainTab.payType)
      // delete this.somainTab.customer;
      console.log(this.somainTab);
      console.log(JSON.stringify(this.somainTab));
      requestPostJson("/api/main/sell/somain/add", this.somainTab).then(
        resp => {
          let res = resp.data;
          console.log("响应", res);
          if (res.code == 2) {
            this.$router.push("/sell/somainmanager");
          }
        }
      );
    },
    getsoTotal() {
      this.somainTab.tipFee = parseFloat(this.somainTab.tipFee);
      let sum = 0;
      for (let i = 0; i < this.tableData.length; i++) {
        sum += this.tableData[i].itemPrice;
      }
      this.somainTab.soTotal = this.somainTab.tipFee + sum;
    },
    paySelect(){
      if(this.somainTab.payType=="3"){
        this.disabled=false;
      }else{
        this.disabled=true
      }
    }
    // customerCheck() {
    //   if (this.somainTab.customer == "") {
    //     this.err1 = "不能为空";
    //   } else {
    //     this.err1 = "";
    //   }
    // },
    // tipFeeCheck() {
    //   if (this.somainTab.tipFee < 0) {
    //     this.err2 = "不能为负数";
    //   } else {
    //     this.err2 = "";
    //   }
    // },
    // payTypeCheck() {
    //   if (this.somainTab.payType == "") {
    //     this.err3= "不能为空";
    //   } else {
    //     this.err3= "";
    //   }
    // },
    // prePayFeeCheck() {
    //   if (this.somainTab.prePayFee < 0) {
    //     this.err4= "不能为负数";
    //   } else {
    //     this.err4 = "";
    //   }
    // }
  }
};
</script>
<style scoped>
.somainTab {
  width: 1100px;
  font-size: 12px;
  border: 1px solid #ccc;
  border-collapse: collapse;
  margin-top: 10px;
}
.somainTab td {
  border-right: dotted 1px #c7c7c7;
  height: 50px;
  text-indent: 10px;
}
.somainTab tr:nth-child(2) {
  background-color: #f5f8fa;
}
.somainTab .el-input {
  width: 200px;
}
.somainTab .el-select {
  width: 200px;
}
.vcipt {
  width: 217px;
}
.customerIpt {
  font-size: 12px;
}
.btn {
  padding: 2px 3px;
}
.el-table .el-input {
  width: 120px;
}
.err {
  color: red;
}
</style>