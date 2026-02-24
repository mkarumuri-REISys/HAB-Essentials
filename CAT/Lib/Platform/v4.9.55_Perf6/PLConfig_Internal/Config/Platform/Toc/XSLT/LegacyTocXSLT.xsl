<?xml version="1.0" encoding="utf-8"?>

<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:asp="remove" xmlns:rei="remove">
	<xsl:param name="showTocHeader" />
	<xsl:template match="/">
		
		<!-- default controller at Toc level-->
		<xsl:variable name="toc_defaultControllerURL">
			<xsl:value-of select="toc/defaultControllerURL"/>
		</xsl:variable>

		<table align="center" class="TocTable" cellspacing="1">
			<xsl:if test="$showTocHeader='true'">
			<tr class='headerMain'>
				<td colspan='3'>
					TABLE OF CONTENTS
				</td>
			</tr>
			</xsl:if>
			<tr align="center">
				<td class="BorderedGrayTd" id="sectionheader">
						Section
				</td>
				<td class="BorderedGrayTd" id="typeheader">
						Type
				</td>
				<td class="BorderedGrayTd" id="actionheader">
						Action
				</td>
			</tr>
			<xsl:for-each select="toc/section">
				<xsl:call-template name ="Section">
					<xsl:with-param name="toc_defaultControllerURL" select ="$toc_defaultControllerURL" />
				</xsl:call-template>
			</xsl:for-each>
		</table>
	</xsl:template>
	
	<!-- Section Template -->
	<xsl:template name="Section">
		<xsl:param name ="toc_defaultControllerURL"></xsl:param>
		<!-- default controller at Section level-->
		<xsl:variable name="section_defaultControllerURL">
			<!-- If default controller at Section level is not specified, 
					set toc_defaultControllerURL to section_defaultControllerURL variable -->
			<xsl:if test="count(defaultControllerURL)=0 or defaultControllerURL = ''"><xsl:value-of select="$toc_defaultControllerURL"/></xsl:if>
			<!-- If default controller at Section level is specified, 
					set it to section_defaultControllerURL variable -->
			<xsl:if test="count(defaultControllerURL)>0 and defaultControllerURL != ''"><xsl:value-of select="defaultControllerURL"/></xsl:if>
		</xsl:variable>
		<xsl:element name="tr">
			<xsl:attribute name="class">
				<xsl:if test="count(@customCss)=0 or @customCss = ''">bgYellow</xsl:if>
				<xsl:if test="count(@customCss)>0 and @customCss != ''"><xsl:value-of select="@customCss"/></xsl:if>
			</xsl:attribute>
			<td class="BorderedWhiteTd" colspan="3">
				<xsl:if test="count(@displayValue)=0 or @displayValue = ''">&#160;</xsl:if>
				<xsl:if test="count(@displayValue)>0 and @displayValue != ''"><xsl:value-of select="@displayValue"/></xsl:if>
			</td>
		</xsl:element>
		<!--<tr class="bgYellow">
			<td class="BorderedWhiteTd" colspan="3">
				<xsl:value-of select="@displayValue"/>
			</td>
		</tr>-->
		<xsl:for-each select="node()">
			<xsl:choose>
				<xsl:when test ="local-name()  = 'section'">
					<xsl:call-template name ="Section">
						<xsl:with-param name="toc_defaultControllerURL" select ="$toc_defaultControllerURL" />
					</xsl:call-template>
				</xsl:when>
				<xsl:when test ="local-name()  = 'item'">
					<xsl:call-template name ="Item">
						<xsl:with-param name="section_defaultControllerURL" select ="$section_defaultControllerURL" />
					</xsl:call-template>
				</xsl:when>
				<xsl:otherwise>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:for-each>
	</xsl:template>

	<!-- Item Template -->
	<xsl:template name ="Item">
		<xsl:param name ="section_defaultControllerURL"></xsl:param>
					<!-- default controller at Item level-->
			<xsl:variable name="item_defaultControllerURL">
				<!-- If default controller at item level is not specified, 
					set section_defaultControllerURL to item_defaultControllerURL variable -->
				<xsl:if test="count(defaultControllerURL)=0 or defaultControllerURL = ''"><xsl:value-of select="$section_defaultControllerURL"/></xsl:if>
				<!-- If default controller at item level is specified, 
					set it to item_defaultControllerURL variable -->
				<xsl:if test="count(defaultControllerURL)>0 and defaultControllerURL != ''" ><xsl:value-of select="defaultControllerURL"/></xsl:if>
			</xsl:variable>

			<xsl:variable name="displayNotAvailable">
				<!-- If displayNotAvailable is not specified or displayNotAvailable='true', 
										set displayNotAvailable to true -->
				<xsl:if test="count(@displayNotAvailable)=0 or @displayNotAvailable='true'"><xsl:text>true</xsl:text></xsl:if>
				<!-- If displayNotAvailable is specified as false, set displayNotAvailable to false -->
				<xsl:if test="@displayNotAvailable='false'"><xsl:text>false</xsl:text></xsl:if>
			</xsl:variable>

			<xsl:variable name="itemType"><xsl:value-of select="@type"/></xsl:variable>

			<tr bgcolor='#ffffff'>
				<td class="BorderedWhiteTd" headers="sectionheader" style="width: 80%;">
					<xsl:choose>
						<xsl:when test ="@purposeDescription and @purposeDescription != ''">
							<xsl:choose>
								<xsl:when test ="@displayValue and contains(@displayValue, '(')">
									<xsl:variable name="before" select="substring-before(@displayValue, '(')"/>
									<xsl:variable name="after" select="substring-after(@displayValue, '(')"/>
									<xsl:value-of select="concat($before, ' - ', @purposeDescription, ' (', $after)" />
								</xsl:when>
								<xsl:otherwise>
									<xsl:value-of select="@displayValue"/>
									-<xsl:value-of select="@purposeDescription"/>
								</xsl:otherwise>
							</xsl:choose>
						</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select="@displayValue"/>
						</xsl:otherwise>
					</xsl:choose>
				</td>
				<td class="BorderedWhiteTd" align="center" headers="typeheader" style="width: 10%;"><xsl:value-of select="@type"/></td>
				<td class="BorderedWhiteTd" align="center" headers="actionheader" style="width: 10%;">
					<xsl:for-each select="action">
						<!-- default controller at action level-->
						<xsl:variable name="action_URL">
							<xsl:choose>
								<!-- If pageURL at action level is not specified and the type of item is HTML, 
										set item_defaultControllerURL to action_URL variable -->
								<xsl:when test="(count(@pageURL)=0 or @pageURL = '') and $itemType = 'HTML'"><xsl:value-of select="$item_defaultControllerURL"/></xsl:when>
								<!-- If pageURL at action level is specified, 
										set it to action_URL variable -->
								<xsl:when test="count(@pageURL)>0 and @pageURL != ''"><xsl:value-of select="@pageURL"/></xsl:when>
								<!-- otherwise set action_URL to empty -->
								<xsl:otherwise></xsl:otherwise>
							</xsl:choose>
						</xsl:variable>

						<xsl:choose>
							<!-- If $action_URL is not empty render the URL -->
							<xsl:when test="$action_URL!=''">
								<xsl:element name="rei:REIHyperLink">
									<xsl:attribute name="runat">server</xsl:attribute>
									<xsl:attribute name="NavigateUrl"><xsl:value-of select="$action_URL"/></xsl:attribute>
									<xsl:attribute name="NavigationType">Popup</xsl:attribute>
									<xsl:attribute name="id">ActionId_<xsl:value-of select="@id"/></xsl:attribute>
									<xsl:attribute name="Text"><xsl:value-of select="@displayValue"/></xsl:attribute>
								</xsl:element>
							</xsl:when>
							<!-- If $action_URL is empty and $displayNotAvailable is true then display 'Not Available -->
							<xsl:otherwise>
								<xsl:if test="$displayNotAvailable = 'true'">Not Available</xsl:if>
								<xsl:text disable-output-escaping="yes">&amp;nbsp;</xsl:text>
							</xsl:otherwise>
						</xsl:choose>
					</xsl:for-each>
				</td>
			</tr>
	</xsl:template>
	
</xsl:stylesheet>

