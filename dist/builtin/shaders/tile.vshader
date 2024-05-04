attribute vec4 a_Position;

uniform mat4 u_Transform;

// added
varying vec4 v_coords;

void main(){
	gl_Position = u_Transform * a_Position;

	v_coords = a_Position;
}