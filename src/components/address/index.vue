<template>
  <div class="index_address frame_cnt">
    <div class="member_container">
      <div class="member_colLeft">
        <member-left
          :departlist="departlist"
          @selectdepart="selectdepart"
          @selectuser="selectuser"
        ></member-left>
      </div>
      <div class="member_colRight">
        <member-right
          :selectFile="selectFile"
          v-if="is_user == false"
        ></member-right>
        <look-editor
          :userdetail="userdetail"
          :editor_show="is_user"
        ></look-editor>
      </div>
    </div>
  </div>
</template>
<script>
import MemberLeft from './components/memberLeft'
import MemberRight from './components/memberRight'
import LookEditor from './components/Lookeditor'
export default {
  name: "index_address",
  components: { MemberLeft, MemberRight, LookEditor },
  data () {
    return {
      departlist: [],
      selectFile: {},
      userdetail: {},
      is_user: false,
    }
  },
  methods: {
    selectuser (node) {
      this.userdetail = node.data
      this.is_user = true
      // this.departlist = node.data
      console.log(node)
      this.selectFile = { data: { id: node.data.UserId, Department: node.data.Department, depart_id: node.data.DepartmentId } }
      // this.userDetail(node.data)
    },
    filterNode (value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    selectdepart (val) {
      this.is_user = false
      this.selectFile = { data: val.data }
      console.log(val)
    },
    addressclick (node) {
      this.selectFile = node
    },
    getalldepart () {
      let payload = {
        corpid: this.$store.state.corpid
      }
      console.log(payload)
      let createvalue = this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = this.$apilist['getalldepartment'] + '?signature=' + keyvalue;
      let _this = this
      this.$server.post(posturl, createvalue['fd']).then(data => {
        console.log(data)
        _this.departlist = data.data
        _this.selectFile = { data: { id: data.data[0].id, Department: data.data[0].Department, depart_id: data.data[0].depart_id } }
      }).catch(err => {
        console.log(err)
      })

    },
    userDetail (item) {
      let payload = {
        corpid: this.$store.state.corpid,
        userid: item.u
      }
      console.log(payload)
      console.log(item)
      let createvalue = this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = this.$apilist['oneuserdetail'] + '?signature=' + keyvalue;
      let _this = this
      this.$server.post(posturl, createvalue['fd']).then(data => {
        console.log(data)
        _this.departlist = data.data
        _this.selectFile = { data: { id: data.data[0].id, Department: data.data[0].Department, depart_id: data.data[0].depart_id } }
      }).catch(err => {
        console.log(err)
      })

    }

  },
  mounted () {

    // this.selectFile = { label: this.data[0].label }
    this.getalldepart()
  },
  // watch: {
  //   filterText (val) {
  //     this.$refs.tree.filter(val);
  //   }
  // },
}
</script>
<style lang="less">
.index_address {
  margin-top: 20px;
  .member_container {
    display: table;
    table-layout: fixed;
    width: 100%;
  }
  .member_colLeft {
    display: table-cell;
    vertical-align: top;
    background-color: #f9fafc;
    border-right: 1px dotted #dce1e6;
    border-radius: 4px 0 0 4px;
    width: 260px;
  }
  .member_colRight {
    display: table-cell;
    height: 792px;
    padding: 16px 16px 24px;
    vertical-align: top;
    position: relative;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
}
</style>