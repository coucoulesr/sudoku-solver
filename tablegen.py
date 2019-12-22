with open("table", "w") as file:
    s = "<table>\n"
    for row in range(9):
        s += "<tr>\n"
        for col in range(9):
            mem = '<td id="t' + str(row) + str(col) + '"'
            if row % 3 == 2 and row != 8:
                mem += ' class="bb'
                if col % 3 == 2 and col != 8:
                    mem += ' br'
                mem +='"'
            elif col % 3 == 2 and col != 8:
                mem += ' class="br"'
            mem += ' contenteditable="true"></td>\n'
            s += mem
        s += "</tr>\n"
    s += "</table>"
    file.write(s)