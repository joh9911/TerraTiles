precision mediump float;

uniform vec4 u_Color;

// added
varying vec4 v_coords;

void main(){
	if (u_Color.x == 1.0) {
		if (v_coords.x < -0.44) {
			float y_color = (v_coords.y + 0.21) / 2.0;
			gl_FragColor = vec4(1.00, y_color, 0.0, 1.0);
		} else if (v_coords.y > 0.21) {
			float x_color = 1.0 - (v_coords.x + 0.44);
			gl_FragColor = vec4(x_color, 0.990, 0.0297, 1.0);
		} else if (v_coords.x > 0.435) {
			float y_color = (v_coords.y + 0.21);
			gl_FragColor = vec4(0.00, y_color, 0.980, 1.0);
		} else if (v_coords.y < -0.205) {
			float x_color = 1.0 - (v_coords.x + 0.44);
			gl_FragColor = vec4(x_color, 0.0297, 0.990, 1.0);
		} else {
			gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
		}
	} else if (u_Color.x == 0.0) {
		if (v_coords.x < -0.44 || v_coords.y > 0.21 || v_coords.x > 0.435 || v_coords.y < -0.205) {
			gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
		} else {
			gl_FragColor = vec4(1.0, 1.0, 1.0, 0.0);
		}
	} else {
		gl_FragColor = vec4(1.0, 1.0, 1.0, 0.0);
	}
}