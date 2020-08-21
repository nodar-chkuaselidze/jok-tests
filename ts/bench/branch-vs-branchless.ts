const N = 10000000;


// level is a numbeb from 0 to 9
function isNaxatianiCard(level: number) {
  return level >= 5 ? 17 : 12;
}

function isNaxatianiCardBL(level: number) {
  let response = 0;

  response += 17 * (level >= 5);
  response += 12 * (level < 5);

  return response;
}


{

}
