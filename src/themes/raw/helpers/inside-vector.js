export const insideVector = ([x1, y1, z1], [x2, y2, z2], [x3, y3, z3]) =>
	x1 >= x2 && x1 <= x3
	&& y1 >= y2 && y1 <= y3
	&& z1 >= z2 && z1 <= z3
