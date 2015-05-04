#
# Convert the reports-messages.properties file to a markdown table
#
source = ARGV[0] || 'reports-messages.properties'
dest = ARGV[1] || '../_includes/event_list.md'

newfile = File.open(dest, "w")
started = false
is_table_open = false

# These are for tracking descriptions that span multiple lines
current_key = ''
current_value = ''

def open_table(file)
    file.puts(
'<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>Event ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>')
end

File.foreach(source, :encoding => 'iso-8859-1:utf-8') do |line|

    # If we haven't started
    if !started
        if /###\sSTART\s###/ =~ line
            started = true
        end

    # See if we have a heading
    elsif /\#{2,6}\s([-A-Za-z\s]+)/ =~ line
        # Close the last table, if there is one
        if is_table_open
            newfile.puts("</tbody></table>\n\n")
            is_table_open = false
        end
        newfile.puts("\##{line}\n")

    # See if we have an event
    elsif line.include? "="
        key, value = line.split("=", 2)
        key.strip!
        value.strip!

        # If value ends in a \, get the next line
        if value[-1] == '\\'
            value[-1] = ""
            current_key = key
            current_value += value
        else
            if !is_table_open
                open_table(newfile)
                is_table_open = true
            end

            # Include a zero width space with each period to allow breaking on periods
            key = key.gsub(/\./, '.&#8203;')
            newfile.puts(
"<tr>
    <td>#{key}</td>
    <td>#{value}</td>
</tr>")
        end

    # See if we have more of a description
    elsif current_value != ""
        value = line.strip()

        # If there are still more lines
        if value[-1] == '\\'
            value[-1] = ""
            current_value += value

        # Otherwise, there are no more line continuations
        else
            if !is_table_open
                open_table(newfile)
                is_table_open = true
            end

            # Write the completed key and value
            current_value += value
            newfile.puts(
"<tr>
    <td>#{current_key}</td>
    <td>#{current_value}</td>
</tr>")
            # Clear out the values
            current_key = current_value = ""
        end
    end
end

newfile.puts("</tbody></table>")

newfile.close