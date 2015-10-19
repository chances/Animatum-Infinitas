/* Parses and generates a ASE AST from an ASE ASCII Scene file. */

/* lexical grammar */
%lex

%%
[0-9A-Za-z]+":"         return 'INDEX';
"-"?[0-9]+"."[0-9]+\b   return 'FLOAT';
"-"?[0-9]+\b            return 'INTEGER';
"\""[^"]*"\""           return 'STRING';
"*"[A-Z0-9_]+           return 'NODE';
[A-Za-z]+               return 'SYMBOL';
"{"                     return 'BLOCK_START';
"}"                     return 'BLOCK_END';
\s+                     /* skip whitespace */
<<EOF>>                 return 'EOF';

/lex

%{
    function nodeName(node) {
      return node.replace('*','');
    }
    function nodeBlock(type, children) {
      this.type = type;
      this.children = children;
    }
    function nodeNumber(name, value) {
      this.name = name;
      this.value = value;
    }
    function nodeString(name, value) {
      this.name = name;
      this.value = value;
    }
    function nodeVector3(name, x, y, z) {
      this.name = name;
      this.x = x;
      this.y = y;
      this.z = z;
    }
    function nodeIndexedVector3(name, index, x, y, z) {
      this.name = name;
      this.index = index;
      this.x = x;
      this.y = y;
      this.z = z;
    }
    function nodeMeshFace(name, index, a, b, c, ab, bc, ca, smoothing, materialId) {
      this.name = name;
      this.index = index;
      this.a = a;
      this.b = b;
      this.c = c;
      this.ab = ab;
      this.bc = bc;
      this.ca = ca;
      this.smoothing = smoothing.value;
      this.materialId = materialId.value;
    }
    function prependChild(node, child){
      node.splice(0,0,child);
      return node;
    }
%}

%% /* language grammar */

ase
    : nodeList EOF
        {{$$ = $1; return $$;}}
    ;

nodeList
    : nodeBlock nodeList
        {{$$ = prependChild($2, $1)}}
    | node nodeList
        {{$$ = prependChild($2, $1)}}
    | nodeBlock
        {{$$ = [$1]}}
    | node
        {{$$ = [$1]}}
    ;

nodeBlock
    : NODE BLOCK_START nodeList BLOCK_END
        {{$$ = new nodeBlock(nodeName($1), $3)}}
    | NODE BLOCK_START BLOCK_END
        {{$$ = new nodeBlock(nodeName($1), [])}}
    ;

node
    : nodeMeshFace
    | nodeIndexedVector3
    | nodeMeshTFace
    | nodeVector3
    | nodeNumber
    | nodeString
    ;

nodeNumber
    : NODE number
        {{$$ = new nodeNumber(nodeName($1), $2)}}
    ;

nodeString
    : NODE STRING
        {{$$ = new nodeString(nodeName($1), $2.slice(1, $2.length - 1));}}
    ;

nodeVector3
    : NODE int int int
        {{$$ = new nodeVector3(nodeName($1), $2, $3, $4);}}
    | NODE float float float
        {{$$ = new nodeVector3(nodeName($1), $2, $3, $4);}}
    ;

nodeIndexedVector3
    : NODE int float float float
        {{$$ = new nodeIndexedVector3(nodeName($1), $2, $3, $4, $5);}}
    ;

nodeMeshTFace
    : NODE int int int int
        {{$$ = new nodeIndexedVector3(nodeName($1), $2, $3, $4, $5);}}
    ;

nodeMeshFace
    : NODE INDEX INDEX int INDEX int INDEX int INDEX int INDEX int INDEX int nodeNumber nodeNumber
        {{$$ = new nodeMeshFace($1, $2, $4, $6, $8, $10, $12, $14, $15, $16);}}
    ;

number
    : int | float;

int
    : INTEGER
        {{$$ = parseInt(yytext, 10);}}
    ;

float
    : FLOAT
        {{$$ = parseFloat(yytext);}}
    ;
