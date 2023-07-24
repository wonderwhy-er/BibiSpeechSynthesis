const {FastText,addOnPostRun}  = require('./fasttext');

const printVector = function(predictions, limit) {
    limit = limit || Infinity;

    for (let i=0; i<predictions.size() && i<limit; i++){
        let prediction = predictions.get(i);
        console.log(predictions.get(i));
    }
}

const trainCallback = (progress, loss, wst, lr, eta) => {
    console.log([progress, loss, wst, lr, eta]);
};

addOnPostRun(() => {
    let ft = new FastText();

    ft.trainSupervised("../examples/dataset/cooking_dataset_train.tsv", {
        'lr':1.0,
        'epoch':10,
        'loss':'hs',
        'wordNgrams':2,
        'dim':50,
        'bucket':200000
    }, trainCallback).then(model => {
        console.log('Trained.');

        printVector(model.predict("Which baking dish is best to bake a banana bread ?", 5, 0.0));

        /* getInputMatrix */
        let inputMatrix = model.getInputMatrix();
        console.log(inputMatrix.cols());
        console.log(inputMatrix.rows());
        console.log(inputMatrix.at(1, 2));

        /* getOutputMatrix */
        let outputMatrix = model.getOutputMatrix();
        console.log(outputMatrix.cols());
        console.log(outputMatrix.rows());
        console.log(outputMatrix.at(1, 2));

        /* getWords */
        let wordsInformation = model.getWords();
        printVector(wordsInformation[0], 30);   // words
        printVector(wordsInformation[1], 30);   // frequencies

        /* getLabels */
        let labelsInformation = model.getLabels();
        printVector(labelsInformation[0], 30);  // labels
        printVector(labelsInformation[1], 30);  // frequencies
    });
});