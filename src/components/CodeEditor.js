import styles from './CodeEditor.css';

import React, {Component} from 'react';
import './CodeEditor.css';

import cm from 'codemirror'; // 库导出的对象
import 'codemirror/lib/codemirror.css'; // 引入默认样式
import 'codemirror/mode/javascript/javascript' // 引入js高亮

// 主题风格
import 'codemirror/theme/material.css';
import 'codemirror/theme/solarized.css';
import 'codemirror/theme/seti.css'

class CodeEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // didmount加载数据
  componentDidMount() {
    this.codeMirror = cm.fromTextArea(document.getElementById('myEditor'), {
      //javascript高亮显示
      mode: {name: "javascript", json: true},
      theme: 'material',
      //显示行号
      lineNumbers: true,
      //全屏模式
      fullScreen: true,
      //括号匹配
      matchBrackets: true,
    })
    this.codeMirror.on("change", this.onValueChange);
    this.codeMirror.setSize('50%', 500);

    this.exampleMirror = cm.fromTextArea(document.getElementById('exampleEditor'), {
      //javascript高亮显示
      mode: {name: "javascript", json: true},
      //显示行号
      lineNumbers: true,
      //全屏模式
      fullScreen: true,
      //括号匹配
      matchBrackets: true,
      readOnly: true
    })
    this.exampleMirror.on("change", this.onValueChange);
    this.exampleMirror.setSize('50%', 500);
  }

  onValueChange = (instance, changeObj) => {
    // console.log(changeObj);
    // 将目前的value同步到上一层的value中
    const currentValue = this.codeMirror.doc.getValue();
    const {handleValueChange} = this.props;
    handleValueChange(currentValue);
  };

  render() {
    const {value} = this.props;

    const {handleValueChange} = this.props;

    const exampleValue = `/**如下为示例运行代码，格式供参考**/
/**
<parameter>
{
    "inputs": [{
        "name": "num1",
        "dataType": "NUMBER",
        "value": "0"
    },{
        "name": "num2",
        "dataType": "NUMBER",
        "value": "0"
    }],
    "outputs": [{
        "name": "result",
        "dataType": "NUMBER",
        "value": "0"
    }]
}
</parameter>
 */
function test(num1, num2) {
var i;
var arr = [1,2,3,4,5,6,7,8,9,0];
for (i = 0; i < 1000; i++) {
    // 这个if语句的条件和执行体是随便写的，目的是让程序尽可能多运算一点时间，得到一个相对大的时间差
    if ( "1234567890".search(/\\d{10}/) > -1 ) {
        arr.map(function(x) {return x});
    };
  }
}
    `

    return (
      <div className={styles.wrapper}>
        <textarea style={{width: '50%'}} id='myEditor' autoComplete='off' defaultValue={value}/>
        <textarea style={{width: '50%'}} id='exampleEditor' autoComplete='off' defaultValue={exampleValue}/>
      </div>
    );
  }
}

export default CodeEditor;
