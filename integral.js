(function(){
	var source = "https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML.js";
	var upper = rand(0, 11);
	var lower = rand(-11, 0);
	var num = 4; 
	var promiseLoad = new Promise(init);
	var QUEUE;
	var proto;

	function init(resolve, reject) {
		var script = document.createElement('script');
		script.src = source;

		script.onload = function(){
			MathJax.Hub.Config({
			  	tex2jax: {
			    	inlineMath: [ ['$','$'], ['\\(','\\)'] ]
			  	}
			});
			QUEUE = MathJax.Hub.queue;  // shorthand for the queue
			resolve();
		};

		script.onerror = function() {
			reject();
		};

		document.head.appendChild(script);
	}

	function rand(lower, upper) {
		return Math.floor(Math.random() * (upper - lower) + lower);
	}

	function generateEquationInLateX() {
		var answer;
		var text = '$\\int\\limits_{'+ lower + '}^{' + upper + '}';


		for(var i = 0; i < num; i++){
		  	var k = rand(1, 6); // Коэффициент перед x
		  	var p = rand(1, 6); // Показатель степени x
		  	var sign = rand(0, 3) === 0 ? 0 : 1; // Знак, плюс будет в 2 раза чаще
		  	var tt = k > 1 ? k : ""; // Временная переменная для хранения слагаемого

		  	tt += "x";
		  	if(p > 1) {
		  		tt += "^" + p;
		  	}
		  	if(i === 0){
		    	if(sign === 1) {
		    		text += "({-}" + tt +")";
		    	}
		    	else {
		    		text += tt;
		    	}
		  	}
		  	else {
		  		text += (sign === 1 ? "-" : "+") +tt;
		  	}
		  	if(sign === 1) {
		  		k = -k;
		  	}
		  	answer += (k * Math.pow(upper, p + 1) / (p + 1)) - (k * Math.pow(lower, p + 1)/(p + 1));
		  // И заодно считаем ответ.
		}
		text +="dx$";

		return {
			text: text,
			answer: answer
		};
	}

	function drawEquation(element) {
		element.buffer.innerHTML = element.text;
		MathJax.Hub.Queue(['Typeset', MathJax.Hub, element.buffer], function(){
			swapBuffer(element);
		});
	}

	function swapBuffer(element) {
		element.innerHTML = element.buffer.innerHTML;
	}

	proto = Object.create(HTMLElement.prototype);

	proto.createdCallback = function() {
		var self = this;
		self.text = '';
		self.buffer = document.createElement('div');

		promiseLoad.then(self.createEquation.bind(self));
	};

	proto.createEquation = function() {
		var self = this;
		var equation = generateEquationInLateX();

		self.text = equation.text;
		self.answer = equation.answer;
		drawEquation(self);
	};

	document.registerElement('integral-equation', {
		prototype: proto,
	});

})();
