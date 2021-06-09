// AWS.DynamoDB.DocumentClient
// docClient については https://qiita.com/Fujimon_fn/items/66be7b807a8329496899 を読んで理解しよう
const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient({
  region: process.env.DYNAMODB_REGION,
});

// handler 関数
// 3つの引数については https://tech.mti.co.jp/entry/2016/12/02/338/ がわかりやすくまとまってるかも
exports.handler = (event, context, callback) => {
  // API Gateway から渡されるデータについて CloudWatch Log で確認しよう
  console.log("event:", event);

  // 'GET'メソッド && '/students'リソース
  if (event.httpMethod === "GET" && event.pathParameters.proxy === "students") {
    getAllStudents(callback);
  }
};

// 全学生データを取得してコールバック
function getAllStudents(callback) {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
  };

  // DynamoDBから全データ取得
  dynamoDB.scan(params, function (err, data) {
    if (err) {
      console.error("Error:", err);
    } else {
      const response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "*",
        },
        body: JSON.stringify(data),
      };
      callback(null, response);
    }
  });
}