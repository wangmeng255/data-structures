"use strict"
//LinkedList
var LinkedList = function() {
  this.length = 0;
  this.head = null;
};

LinkedList.prototype.insert = function(index, value) {
  if(index < 0 || index > this.length) {
    throw new Error('Index error');
  }

  var newNode = {
    value: value
  }

  if(index === 0) {
    newNode.next = this.head;
    this.head = newNode;
  }
  else {
    var node = this._find(index - 1);
    newNode.next = node.next;
    node.next = newNode;
  }

  this.length++;
};

LinkedList.prototype._find = function(index) {
  var node = this.head;
  for(var i = 0; i < index; i++) {
    node = node.next;
  }
  return node;
};

LinkedList.prototype.get = function(index) {
  if(index < 0 || index >= this.length) {
    throw new Error('Index error');
  }
  return this._find(index).value;
};

LinkedList.prototype.remove = function(index) {
  if(index < 0 || index >= this.length) {
    throw new Error('Index error');
  }

  if(index === 0) {
    this.head = this.head.next;
  }
  else {
    var node = this._find(index - 1);
    node.next = node.next.next;
  }
};

//HashMap using Open Addressing solve collision
var HashMapOpenAddr = function(initialCapacity) {
  this.length = 0;
  this._slots = [];
  this._capacity = initialCapacity || 8;
  this._deleted = 0;
};
HashMapOpenAddr.MAX_LOAD_RATIO = 0.9;
HashMapOpenAddr.SIZE_RATIO = 3;

HashMapOpenAddr._hashString = function(string) {
  var hash = 5381;
  for (var i = 0; i < string.length; i++) {
    hash = (hash << 5) + hash + string.charCodeAt(i);
    hash = hash & hash;
  }
  return hash >>> 0;
};

HashMapOpenAddr.prototype.get = function(key) {
  var index = this._findSlot(key);
  if (this._slots[index] === undefined) {
    //throw new Error('Key error');
    return null;
  }
  return this._slots[index].value;
};

HashMapOpenAddr.prototype.set = function(key, value) {
  var loadRatio = (this.length + this._deleted + 1) / this._capacity;
  if (loadRatio > HashMap.MAX_LOAD_RATIO) {
    this._resize(this._capacity * HashMap.SIZE_RATIO);
  }

  var index = this._findSlot(key);
  this._slots[index] = {
    key: key,
    value: value,
    deleted: false
  };
  this.length++;
};

HashMapOpenAddr.prototype.remove = function(key) {
  var index = this._findSlot(key);
  var slot = this._slots[index];
  if (slot === undefined) {
    //throw new Error('Key error');
    return null;
  }
  slot.deleted = true;
  this.length--;
  this._deleted++;
};

HashMapOpenAddr.prototype._findSlot = function(key) {
  var hash = HashMap._hashString(key);
  var start = hash % this._capacity;

  for (var i = start; i < start + this._capacity; i++) {
    var index = i % this._capacity;
    var slot = this._slots[index];
    if (slot === undefined || (slot.key === key && !slot.deleted)) {
      return index;
    }
  }
  // Unreachable
};

HashMapOpenAddr.prototype._resize = function(size) {
  var oldSlots = this._slots;
  this._capacity = size;
  this._deleted = 0;
  this._slots = [];
  for (var i = 0; i < oldSlots.length; i++) {
    var slot = oldSlots[i];
    if (slot !== undefined && !slot.deleted) {
      this.set(slot.key, slot.value);
    }
  }
};

//HashMap using LinkedList solve collision
var HashMap = function(initialCapacity) {
  this.length = 0;
  this._slots = [];
  this._capacity = initialCapacity || 8;
};
HashMap.MAX_LOAD_RATIO = 0.9;
HashMap.SIZE_RATIO = 3;

HashMap._hashString = function(string) {
  var hash = 5381;
  for (var i = 0; i < string.length; i++) {
    hash = (hash << 5) + hash + string.charCodeAt(i);
    hash = hash & hash;
  }
  return hash >>> 0;
};

HashMap.prototype.get = function(key) {
  var index = this._findSlot(key);
  if (this._slots[index] === undefined) {
    //throw new Error('Key error');
    return null;
  } 
  else {
    var slot = this._slots[index];
    slot = slot.head;
    while(slot !== null) {
      if(slot.key === key) return slot.value;
      slot = slot.next;
    }
    return null;
  }
};

HashMap.prototype.set = function(key, value) {
  var loadRatio = (this.length + 1) / this._capacity;
  if (loadRatio > HashMap.MAX_LOAD_RATIO) {
    this._resize(this._capacity * HashMap.SIZE_RATIO);
  }

  var index = this._findSlot(key);
  var slot = {
    key: key,
    value: value,
    next: null
  };

  if(this._slots[index] === undefined) {
    this._slots[index] = new LinkedList();
  }

  slot.next = this._slots[index].head;
  this._slots[index].head = slot;
  this.length++;
};

HashMap.prototype._findSlot = function(key) {
  var hash = HashMap._hashString(key);
  var index = hash % this._capacity;
  return index;
};

HashMap.prototype._resize = function(size) {
  var oldSlots = this._slots;
  this._capacity = size;
  this._slots = [];

  for (var i = 0; i < oldSlots.length; i++) {
    var slot = oldSlots[i];
    if (slot !== undefined) {
      this.set(slot.key, slot.value);
    }
  }
};

//Binary Search Tree
var BinarySearchTree = function(key, value, parent) {
  this.key = key || null;
  this.value = value || null;
  this.parent = parent || null;
  this.left = null;
  this.right = null;
};

BinarySearchTree.prototype.insert = function(key, value) {
  if(this.key === null) {
    this.key = key;
    this.value = value;
  }
  else if(key < this.key) {
    if(this.left === null) {
      this.left = new BinarySearchTree(key, value, this);
    }
    else {
      this.left.insert(key, value);
    }
  }
  else {
    if(this.right === null) {
      this.right = new BinarySearchTree(key, value, this);
    }
    else {
      this.right.insert(key, value);
    }
  }
};

BinarySearchTree.prototype.get = function(key) {
  if(this.key === key) {
    return this.value;
  }
  else if(key < this.key && this.left) {
    return this.left.get(key);
  }
  else if(key > this.key && this.right) {
    return this.right.get(key);
  }
  else {
    throw new Error('Key Error');
  }
};

BinarySearchTree.prototype.remove = function(key) {
  if(this.key === key) {
    if(this.left && this.right) {
      var successor = this.right._findMin();
      this.key = successor.key;
      this.value = successor.value;
      successor.remove(successor.key);
    }
    else if(this.left) {
      this._replaceWith(this.left);
    }
    else if(this.right) {
      this._replaceWith(this.right);
    }
    else {
      this._replaceWith(null);
    }
  }
  else if(key < this.key && this.left) {
    this.left.remove(key);
  }
  else if(key > this.key && this.right) {
    this.right.remove(key);
  }
  else {
    throw new Error('Key Error');
  }
};

BinarySearchTree.prototype._replaceWith = function(node) {
  if(this.parent) {
    if(this === this.parent.left) {
      this.parent.left = node;
    }
    else if(this === this.parent.right) {
      this.parent.right = node;
    }

    if(node) {
      node.parent = this.parent;
    }
  }
  else {
    if(node) {
      this.key = node.key;
      this.value = node.value;
      this.left = node.left;
      this.right = node.right;
    }
    else {
      this.key = null;
      this.value = null;
      this.left = null;
      this.right = null;
    }
  }
};

BinarySearchTree.prototype._findMin = function() {
  if(!this.left) {
    return this;
  }
  return this.left._findMin();
};

$(function() {
  var lessThan = function(question) {
    for(var i = 0; i < question.length; i++) {
      if(question[i] < 5) {
        question.splice(i, 1);
        i--;
      }
    }
  };

  var arrQ1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  lessThan(arrQ1);
  $('body').append(
    '<p> arrQ1: ' + 
    arrQ1.toString() +
    '</p>'
    );

    var sort2Arr = function(arr1, arr2) {
    var i =0;
    var j = 0;
    var res = [];

    var arr1Length = arr1.length;
    var arr2Length = arr2.length;
    arr1.push(Number.POSITIVE_INFINITY);
    arr2.push(Number.POSITIVE_INFINITY);
    while(i < arr1Length || j < arr2Length) {
      if(arr1[i] < arr2[j]) {
        res.push(arr1[i++]);
      }
      else {
        res.push(arr2[j++]);
      }
    }
    return res;
  };

  var arrQ2A = [1, 3, 6, 8, 11];
  var arrQ2B = [2, 3, 5, 8, 9, 10];
  var sortMerge = sort2Arr(arrQ2A, arrQ2B);
  $('body').append(
    '<p> arrQ2: ' + 
    sortMerge.toString() +
    '</p>'
    );

  var productArr = function(arr) {
    var allProduct = 1;
    for(var i = 0; i < arr.length; i++) {
      allProduct = allProduct * arr[i];
    }

    var res = [];
    for(i = 0; i<arr.length; i++) {
      res.push(allProduct / arr[i]);
    }
    return res;
  };
  var arrQ3= [1, 3, 9, 4];
  var product = productArr(arrQ3);
  $('body').append(
    '<p> arrQ3: ' + 
    product.toString() +
    '</p>'
  );

  var linkedList = new LinkedList();
  linkedList.insert(0, 1);
  linkedList.insert(1, 2);
  linkedList.insert(2, 3);
  linkedList.insert(3, 4);
  linkedList.insert(4, 5);

  var linkedlist = "";
  for(var i = 0; i < linkedList.length; i++) {
    linkedlist += String(linkedList.get(i)) + ', ';
  }
  linkedlist = linkedlist.substr(0, linkedList.length * 3 - 2);
  $('body').append('<p>linkedlist: ' + linkedlist + '</p>');

  var node1 = linkedList.head;
  var node2 = linkedList.head;
  while(node2.next !== null) {
    node1 = node1.next;
    node2 = node2.next;
    if(node2.next !== null) node2 = node2.next;
  }
  $('body').append('<p>middle node: ' + node1.value + '</p>');

  node1 = linkedList.head;
  node2 = linkedList.head;
  if(linkedList.length < 3) 
    $('body').append('<p>last 3rd node: there are no more than 3 nodes.</p>');
  node2 = node2.next;
  node2 = node2.next;
  while(node2.next !== null) {
    node1 = node1.next;
    node2 = node2.next;
  }
  $('body').append('<p>last 3rd node: ' + node1.value + '</p>');

  var reserveLinkedList = new LinkedList();
  for(var i = 0; i < linkedList.length; i++) {
    reserveLinkedList.insert(0, linkedList.get(i));
  }
  linkedlist = "";
  for(var i = 0; i < linkedList.length; i++) {
    linkedlist += String(reserveLinkedList.get(i)) + ', ';
  }
  linkedlist = linkedlist.substr(0, reserveLinkedList.length * 3 - 2);
  $('body').append('<p>linkedlist: ' + linkedlist + '</p>');

  linkedList._find(4).next = linkedList._find(2);
  var nodeArr = [];
  var isCycle = false;
  var node = linkedList.head;
  while(node.next !== null && !isCycle) {
    for(var i = 0; i < nodeArr.length; i++) {
      if(node.next === nodeArr[i]) {
        isCycle = true;
        break;
      }
    }
    nodeArr.push(node);
    node = node.next;
  }
  if(isCycle) $('body').append('<p>linkedlist is Cycle.</p>');
  else $('body').append('<p>linkedlist is not Cycle.</p>');

  var hashQ1 = 'aaxxis';
  var hashMap = new HashMap(hashQ1.length);
  var pairs = 0;
  for(var i = 0; i < hashQ1.length; i++) {
    if(hashMap.get(hashQ1[i]) === null) {
      hashMap.set(hashQ1[i], i);
    }
    else pairs++;
  }
  if(pairs === Math.round((hashQ1.length - 1) / 2)) $('body').append('<p>hashQ1 is palindrome.</p>');
  else $('body').append('<p>hashQ1 is not palindrome.</p>');

  var hashQ2 = ['east', 'cars', 'acre', 'arcs', 'teas', 'eats', 'race'];
  var resQ2 = [];
  if(!hashQ2.length) $('body').append('<p>Length of hashQ2 is zero.</p>');

  while(hashQ2.length) {
    var hashMapArr = [];
    var hashMap = new HashMap();
    for(var i = 0; i < hashQ2[0].length; i++) {
      hashMap.set(hashQ2[0][i], i);
    }
    hashMapArr.push(hashQ2[0]);
    hashQ2.splice(0, 1);
    for(var i = 0; i < hashQ2.length; i++) {
      for(var j = 0; j < hashQ2[i].length; j++) {
        if(hashMap.get(hashQ2[i][j]) === null) break;
      }
      if(j === hashQ2[i].length) {
        hashMapArr.push(hashQ2[i]);
        hashQ2.splice(i, 1);
        i--;
      }
    }
    resQ2.push(hashMapArr);
  }
  var resQ2Str = '';
  for(var i = 0; i < resQ2.length; i++) {
    resQ2Str += '[' + resQ2[i].toString() + '], ';
  }
  resQ2Str = resQ2Str.slice(0, resQ2Str.length - 2);
  $('body').append('<p>hashQ2 is ' + resQ2Str + '</p>');

  var hashQ3 = new HashMap(0);
  for(var i = 0; i < hashQ1.length; i++) {
    hashQ3.set(hashQ1[i], i);
  }
  var hashQ3Str = '';
  for(var i = 0; i < hashQ3._slots.length; i++) {
    if(hashQ3._slots[i] !== undefined) {
      var slot = hashQ3._slots[i].head;
      while(slot !== null) {
        hashQ3Str += '[' + String(i) + ', ' +
                         String(slot.key) + ', ' + 
                         String(slot.value) + '] ';
        slot = slot.next;
      }
    }
  }
  $('body').append('<p>hashQ3 is ' + hashQ3Str + '</p>');

  var BST = new BinarySearchTree(8, null, null);
  BST.left = new BinarySearchTree(3, null, BST);
  BST.right = new BinarySearchTree(10, null, BST);
  BST.left.left = new BinarySearchTree(1, null, BST.left);
  BST.left.right = new BinarySearchTree(6, null, BST.left);
  BST.right.right = new BinarySearchTree(14, null, BST.right);
  BST.left.right.left = new BinarySearchTree(4, null, BST.left.right);
  BST.left.right.right = new BinarySearchTree(7, null, BST.left.right);
  BST.right.right.left = new BinarySearchTree(13, null, BST.right.right);

  function isBST(BST) {
    if(!BST.left && !BST.right) return true;
    else {
      for(var prop in BST) {
        if(prop !== "value" && prop !== "key" && prop !== "left" &&
           prop !== "right" && prop !== "parent" && prop !== "insert" &&
           prop !== "remove" && prop !== "_findMin" && prop !== "_replaceWith" &&
           prop !== "get")
          return false;
      }
      if(BST.left && BST.right) return isBST(BST.left) && isBST(BST.right);
      else if(BST.left) {
        if(BST.key < BST.left.key) return false;
        return isBST(BST.left);
      }
      else if(BST.right) {
        if(BST.key > BST.right.key) return false;
        return isBST(BST.right);
      }
    }
    return true;
  }

  var BSTQ1 = isBST(BST);
  $('body').append('<p>BSTQ1 is ' + BSTQ1 + ' binary search tree.</p>');

  function heightOfBST(BST) {
    if(!BST.left && !BST.right) return 1;
    if(BST.left && BST.right) 
      return (heightOfBST(BST.left) > heightOfBST(BST.right) ? (heightOfBST(BST.left) + 1) : (heightOfBST(BST.right) + 1));
    else if(BST.left) return heightOfBST(BST.left) + 1;
    else if(BST.right) return heightOfBST(BST.right) + 1;
  }
  var BSTQ2 = heightOfBST(BST);
  $('body').append('<p>Height of BSTQ2 is ' + BSTQ2 + '.</p>');

  var BSTQ3 = [];
  function inorderTraverse(BST) {
    if(BST === null) return;
    inorderTraverse(BST.left);
    BSTQ3.push(BST.key);
    inorderTraverse(BST.right);
  }
  inorderTraverse(BST);
  $('body').append('<p>The third largest of BSTQ3 is ' + BSTQ3[BSTQ3.length - 3] + '.</p>');
});