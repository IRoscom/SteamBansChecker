/**
 * @param  {Number} count
 * @param  {Array} words Example: ['депутат', 'депутата', 'депутатов'], ['коментарий', 'коментария', 'комментариев']
 * @return {String}
 */
module.exports = (count, words) => {
  var cases = [2, 0, 1, 1, 1, 2];
  return (
    count +
    " " +
    words[
      count % 100 > 4 && count % 100 < 20 ? 2 : cases[Math.min(count % 10, 5)]
    ]
  );
};
